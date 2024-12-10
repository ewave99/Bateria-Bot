let display;
let NotoSansRegular;

function preload() {
    NotoSansRegular = loadFont("/assets/NotoSans-Regular.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    display = new Display(width, height);
    textFont(NotoSansRegular);
}

function draw() {
    cursor(ARROW);
    display.updateMouseHover(mouseX, mouseY);
    display.show();
}


class Display {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.screens = new Array();
        this.current_screen = 0;

        this.#initScreens();
    }

    #initScreens() {
        let home_screen = new Screen("Home");
        home_screen.addComponent(
            new Text(this.width/2, this.height/2-200, "Bateria Bot", 140, 
                true));
        let play_button = new PlayButton(this.width/2-100, this.height/2-100, 
            200, 200);
        home_screen.addComponent(play_button, null,
            () => play_button.mouseHover());
        let credits_button = new TextButton(this.width-100, this.height-50,
            "Credits");
        home_screen.addComponent(credits_button, null,
            () => credits_button.mouseHover());
        let help_button = new TextButton(this.width-250, 50, "Help");
        home_screen.addComponent(help_button, null,
            () => help_button.mouseHover());
        let settings_button = new TextButton(this.width-100, 50, "Settings");
        home_screen.addComponent(settings_button, null,
            () => settings_button.mouseHover());
        this.screens.push(home_screen);
    }

    show() {
        this.screens[this.current_screen].show();
    }

    updateMouseHover(mouse_x, mouse_y) {
        this.screens[this.current_screen].updateMouseHover(mouse_x, mouse_y);
    }
}


class Screen {
    constructor(name, components=new Array()) {
        this.name = name;
        this.components = components;
        this.mouse_clicks = new Array();
        this.mouse_hovers = new Array();
    }

    show() {
        background(255);
        for (let component of this.components) {
            component.draw();
        }
    }

    addComponent(component, mouse_click=null, mouse_hover=null) {
        this.components.push(component);
        if (mouse_click != null)
            this.addMouseClick(new MouseListener(...component.getBoundingBox(),
                mouse_click));
        if (mouse_hover != null)
            this.addMouseHover(new MouseListener(...component.getBoundingBox(),
                mouse_hover));
    }

    addMouseClick(mouse_click) {
        this.mouse_clicks.push(mouse_click);
    }

    addMouseHover(mouse_hover) {
        this.mouse_hovers.push(mouse_hover);
    }

    updateMouseHover(mouse_x, mouse_y) {
        for (let mouse_hover of this.mouse_hovers)
            mouse_hover.update(mouse_x, mouse_y);
    }
}


class Component {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getBoundingBox() {}
}


class TextButton extends Component {
    constructor(x, y, msg) {
        super(x, y);
        this.msg = msg;
        this.text_size = 30;
        this.padding = 10;
        this.background = 255;
        this.#initComponents();
    }

    #initComponents() {
        let bbox = NotoSansRegular.textBounds(this.msg, this.x, this.y,
            this.text_size);
        this.rect = [bbox.x-bbox.w/2-this.padding, bbox.y-this.padding, 
            bbox.w+this.padding*2, bbox.h+this.padding*2];
        this.text = new Text(this.x, this.y, this.msg, 30);
    }

    getBoundingBox() {
        return this.rect;
    }

    mouseHover() {
        this.background = 180;
        cursor(HAND);
    }

    draw() {
        stroke(0);
        fill(this.background);
        rect(...this.rect);
        this.text.draw();
        //reset background
        this.background = 255;
    }
}


class PlayButton extends Component {
    constructor(x, y, w, h) {
        super(x, y);
        this.w = w;
        this.h = h;
        this.background = 255;
        this.#initComponents();
    }

    #initComponents() {
        this.rect = [this.x, this.y, this.w, this.h];
        this.triangle = [this.x+this.w*1/3, this.y+this.h*1/5, 
            this.x+this.w*1/3, this.y+this.h*3/5, 
            this.x+this.w*2/3, this.y+this.h*2/5
        ];
        this.text = new Text(this.x+this.w/2, this.y+this.w*4/5, "Play!", 30);
    }

    mouseHover() {
        this.background = 180;
        cursor(HAND);
    }

    getBoundingBox() {
        return this.rect;
    }

    draw() {
        stroke(0);
        fill(this.background);
        rect(...this.rect);
        triangle(...this.triangle);
        this.text.draw();
        //reset background
        this.background = 255;
    }
}


class Text extends Component {
    constructor(x, y, msg, size, bold=false, align=CENTER) {
        super(x, y);
        this.msg = msg;
        this.size = size;
        this.bold = bold;
        this.align = align;
    }

    getBoundingBox() {
        let bbox = NotoSansRegular.textBounds(this.msg, this.x, this.y,
            this.text_size);
        return [bbox.x, bbox.y, bbox.w, bbox.h];
    }

    draw() {
        fill(0);
        textAlign(this.align);
        if (this.bold) 
            textStyle(BOLD);
        else 
            textStyle(NORMAL);
        textSize(this.size);
        text(this.msg, this.x, this.y);
    }
}


class Image extends Component {
    constructor(x, y, w, h, src) {
        super(x, y);
        this.w = w;
        this.h = h;
        this.src = src;
    }

    getBoundingBox() {
        return [this.x, this.y, this.w, this.h];
    }
}


class Checkbox extends Component {
    constructor(x, y, size, checked=false) {
        super(x, y);
        this.size = size;
        this.checked = checked;
    }

    getBoundingBox() {
        return [this.x, this.y, this.size, this.size];
    }

    toggle() {}
}


class MouseListener {
    constructor(x, y, w, h, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.callback = callback;
    }

    update(mouse_x, mouse_y) {
        if (this.coordsInBox(mouse_x, mouse_y))
            this.callback();
    }

    coordsInBox(x, y) {
        if (x < this.x) return false;
        if (x > this.x + this.w) return false;
        if (y < this.y) return false;
        if (y > this.y + this.h) return false;
        return true;
    }
}