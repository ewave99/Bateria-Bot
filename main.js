let display;

function setup() {
    createCanvas(windowWidth, windowHeight);
    display = new Display(width, height);
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
            new Text(this.width / 2, this.height / 2, "Bateria Bot", 140, true
        ));
        this.screens.push(home_screen);
    }
    show() {
        this.screens[this.current_screen].show();
    }
}


class Screen {
    constructor(name) {
        this.name = name;
        this.components = new Array();
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