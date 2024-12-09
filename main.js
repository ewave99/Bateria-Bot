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
        home_screen.addComponent(new PlayButton(this.width/2-100, 
            this.height/2-100, 200, 200));
        home_screen.addComponent(new TextButton(this.width-100, this.height-50,
            "Credits"));
        home_screen.addComponent(new TextButton(this.width-250, 50, "Help"));
        home_screen.addComponent(new TextButton(this.width-100, 50, "Settings"));

        home_screen.addComponent
        this.screens.push(home_screen);
    }
    show() {
        this.screens[this.current_screen].show();
    }
}


class Screen {
    constructor(name, components=new Array()) {
        this.name = name;
        this.components = components;
        this.mouse_listeners = new Array();
    }

    show() {
        background(255);
        for (let component of this.components) {
            component.draw();
        }
    }

    addComponent(component) {
        this.components.push(component);
    }
}


class Component {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class TextButton extends Component {
    constructor(x, y, msg) {
        super(x, y);
        this.msg = msg;
        this.text_size = 30;
        this.padding = 10;
        this.#initComponents();
    }

    #initComponents() {
        let bbox = NotoSansRegular.textBounds(this.msg, this.x, this.y,
            this.text_size);
        this.rect = [bbox.x-bbox.w/2-this.padding, bbox.y-this.padding, 
            bbox.w+this.padding*2, bbox.h+this.padding*2];
        this.text = new Text(this.x, this.y, this.msg, 30);
    }

    draw() {
        stroke(0);
        noFill();
        rect(...this.rect);
        this.text.draw();
    }
}


class PlayButton extends Component {
    constructor(x, y, w, h) {
        super(x, y);
        this.w = w;
        this.h = h;
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

    draw() {
        stroke(0);
        noFill();
        rect(...this.rect);
        triangle(...this.triangle);
        this.text.draw();
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
}


class Checkbox extends Component {
    constructor(x, y, size, checked=false) {
        super(x, y);
        this.size = size;
        this.checked = checked;
    }

    toggle() {}
}


class MouseListener {
    constructor(x0, y0, x1, y1, callback) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.callback = callback;
    }

    coordsInBox(x, y) {}
}