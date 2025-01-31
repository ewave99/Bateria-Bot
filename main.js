import { MidiEngine } from "./modules/midi-engine.js";
import { PaperTape } from "./modules/paper-tape.js";

let display;
//let BateriaImg;
let AboutText = `Bateria Bot is an online game for those who want to practise
samba rhythms in their own time. The game focuses on a 
simplified version of the piece 'Batucada'.`;


class Display {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.screens = new Object();
        this.current_screen = "home";

        this.#initScreens();
    }

    #initScreens() {
        this.#initHomeScreen();
        this.#initHelpScreen();
        this.#initAboutScreen();
        this.#initControlsScreen();
        this.#initGameScreen();
        this.#initPauseScreen();
    }

    #initHomeScreen() {
        let home_screen = new Screen(this.context, "Bateria Bot");
        home_screen.addComponent(
            new Text(this.context, this.width/2, this.height/2-200, "Bateria Bot", 140, 
                true));
        let play_button = new PlayButton(this.context, this.width/2-100, this.height/2-100, 
            200, 200);
        home_screen.addComponent(play_button, () => this.setScreen("game"),
            () => play_button.mouseHover());
        let credits_button = new TextButton(this.context, this.width-100, this.height-50,
            "Credits");
        home_screen.addComponent(credits_button, null,
            () => credits_button.mouseHover());
        let help_button = new TextButton(this.context, this.width-250, 50, "Help");
        home_screen.addComponent(help_button, () => this.setScreen("help"),
            () => help_button.mouseHover());
        let settings_button = new TextButton(this.context, this.width-100, 50, "Settings");
        home_screen.addComponent(settings_button, null,
            () => settings_button.mouseHover());
        this.screens["home"] = home_screen;
    }

    #initHelpScreen() {
        let help_screen = new Screen(this.context, "Help");
        help_screen.addComponent(
            new Text(this.context, this.width/2, this.height/2-200, "Help", 140, true)
        );
        let tour_button = new TextButton(this.context, this.width/2, this.height/2, "Tour", 
            140);
        help_screen.addComponent(tour_button, null, 
            () => tour_button.mouseHover());
        let about_button = new TextButton(this.context, this.width/4, this.height/2, "About");
        help_screen.addComponent(about_button, () => this.setScreen("about"), 
            () => about_button.mouseHover());
        let controls_button = new TextButton(this.context, this.width*3/4, this.height/2, 
            "Controls");
        help_screen.addComponent(controls_button, 
            () => this.setScreen("controls"), 
            () => controls_button.mouseHover());
        let back_button = new TextButton(this.context, 100, 50, "<-- Back");
        help_screen.addComponent(back_button, () => this.setScreen("home"), 
            () => back_button.mouseHover());
        this.screens["help"] = help_screen;
    }

    #initAboutScreen() {
        let about_screen = new Screen(this.context, "About");
        let back_button = new TextButton(this.context, 100, 50, "<-- Back");
        about_screen.addComponent(back_button, () => this.setScreen("help"), 
            () => back_button.mouseHover());
        about_screen.addComponent(
            new Text(this.context, this.width/2, this.height/2-200, "About", 140, true)
        );
        about_screen.addComponent(new Text(this.context, 200, this.height/2-100, 
            AboutText, 30, true, this.context.LEFT));
        about_screen.addComponent(new Rectangle(this.context, this.width/2+200, 
            this.height/2-150, 300, 400));
        this.screens["about"] = about_screen;
    }

    #initControlsScreen() {
        let controls_screen = new Screen(this.context, "Controls");
        let back_button = new TextButton(this.context, 100, 50, "<-- Back");
        controls_screen.addComponent(back_button, () => this.setScreen("help"), 
            () => back_button.mouseHover());
        controls_screen.addComponent(
            new Text(this.context, this.width/2, this.height/2-200, "Controls", 140, true)
        );
        controls_screen.addComponent(
            new Text(this.context, this.width/3, this.height/2-100, "< or ,")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width*2/3, this.height/2-100, 
                "Hit surdo with left hand.")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width/3, this.height/2-50, "> or .")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width*2/3, this.height/2-50, 
                "Hit surdo with right hand.")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width/3, this.height/2, "Shift")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width*2/3, this.height/2, "Mute surdo with palm.")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width/3, this.height/2+50, "Spacebar")
        );
        controls_screen.addComponent(
            new Text(this.context, this.width*2/3, this.height/2+50, "Pause game.")
        );
        this.screens["controls"] = controls_screen;
    }

    #initGameScreen() {
        let game_screen = new Screen(this.context, "Bateria Bot");
        let pause_button = new TextButton(this.context, this.width-300, 50, 
            " ⏸ ", 30, this.context.NotoSansSymbols2);
        game_screen.addComponent(pause_button, () => this.setScreen("pause"),
            () => pause_button.mouseHover());
        let help_button = new TextButton(this.context, this.width-225, 50, "?");
        game_screen.addComponent(help_button, () => this.setScreen("help"),
            () => help_button.mouseHover());
        let settings_button = new TextButton(this.context, this.width-100, 50, "Settings");
        game_screen.addComponent(settings_button, () => this.setScreen("settings"),
            () => settings_button.mouseHover());
        
        let paper_tape = new PaperTape(this.context, 50, 100, this.width-100, 100);
        paper_tape.importSequencesObj(this.context.midi_engine.sequences);
        game_screen.addComponent(paper_tape);

        let hand_signal_box = new SignalBox(this.context, 50, 300, 200, "Hand signal:");
        game_screen.addComponent(hand_signal_box);

        let whistle_box = new SignalBox(this.context, 50, 600, 150, "Whistle:");
        game_screen.addComponent(whistle_box);

        let player_visual = new PlayerVisual(this.context, this.width/2, 300, 300, 300);
        let event_text = new Text(this.context, this.width/2+150, 400, "", 140);

        game_screen.addKeyPress(new KeyboardListener(188, () => event_text.updateMsg("L"))); // < or ,
        game_screen.addKeyPress(new KeyboardListener(190, () => event_text.updateMsg("R"))); // > or .
        game_screen.addKeyPress(new KeyboardListener(this.context.SHIFT, () => event_text.updateMsg("M")));

        game_screen.addKeyPress(new KeyboardListener(32, () => this.setScreen("pause"))); // space

        game_screen.addComponent(event_text);
        game_screen.addComponent(player_visual);

        //game_screen.onStart(() => this.context.Batucada120Bpm.play());

        this.screens["game"] = game_screen;
    }

    #initPauseScreen() {
        let pause_screen = new Screen(this.context, "Pause");
        pause_screen.addComponent(
            new Text(this.context, this.width/2, this.height/2-200, "Pause", 140, 
                true));
        pause_screen.addKeyPress(new KeyboardListener(32, () => this.setScreen("game")));
        this.screens["pause"] = pause_screen;
    }

    show() {
        this.screens[this.current_screen].show();
        document.title = this.screens[this.current_screen].name;
    }

    updateMouseHover(mouse_x, mouse_y) {
        this.screens[this.current_screen].updateMouseHover(mouse_x, mouse_y);
    }

    updateMouseClick(mouse_x, mouse_y) {
        this.screens[this.current_screen].updateMouseClick(mouse_x, mouse_y);
    }

    updateKeyPress(key_code) {
        this.screens[this.current_screen].updateKeyPress(key_code);
    }

    setScreen(screen_name) {
        if (Object.keys(this.screens).includes(screen_name)) {
            this.current_screen = screen_name;
            this.screens[this.current_screen].start();
        }
    }
}


class Screen {
    constructor(context, name, components=new Array()) {
        this.context = context;
        this.name = name;
        this.components = components;
        this.mouse_clicks = new Array();
        this.mouse_hovers = new Array();
        this.key_presses = new Array();
        this.start_fun = null;
    }

    show() {
        this.context.background(255);
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

    addKeyPress(key_press) {
        this.key_presses.push(key_press);
    }

    updateMouseHover(mouse_x, mouse_y) {
        for (let mouse_hover of this.mouse_hovers)
            mouse_hover.update(mouse_x, mouse_y);
    }

    updateMouseClick(mouse_x, mouse_y) {
        for (let mouse_click of this.mouse_clicks)
            mouse_click.update(mouse_x, mouse_y);
    }

    updateKeyPress(key, key_code) {
        for (let key_press of this.key_presses)
            key_press.update(key, key_code);
    }

    onStart(fun) {
        this.start_fun = fun;
    }

    start() {
        if (this.start_fun !== null)
            this.start_fun();
    }
}


class Component {
    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
    }

    getBoundingBox() {}
    draw() {}
}


class Rectangle extends Component {
    constructor(context, x, y, w, h) {
        super(context, x, y);
        this.w = w;
        this.h = h;
    }

    getBoundingBox() {
        return [this.x, this.y, this.w, this.h];
    }

    draw() {
        this.context.stroke(0);
        this.context.noFill();
        this.context.rect(this.x, this.y, this.w, this.h);
    }
}


class TextButton extends Component {
    constructor(context, x, y, msg, text_size=30, font) {
        super(context, x, y);
        this.msg = msg;
        this.text_size = text_size;
        this.padding = 10;
        this.background = 255;
        this.font = font || context.NotoSansRegular;
        this.#initComponents();
    }

    #initComponents() {
        let bbox = this.font.textBounds(this.msg, this.x, this.y,
            this.text_size);
        this.rect = [bbox.x-bbox.w/2-this.padding, bbox.y-this.padding, 
            bbox.w+this.padding*2, bbox.h+this.padding*2];
        this.text = new Text(this.context, this.x, this.y, this.msg, this.text_size, false, this.context.CENTER, this.font);
    }

    getBoundingBox() {
        return this.rect;
    }

    mouseHover() {
        this.background = 180;
        this.context.cursor(this.context.HAND);
    }

    draw() {
        this.context.textFont(this.font);
        this.context.stroke(0);
        this.context.fill(this.background);
        this.context.rect(...this.rect);
        this.text.draw();
        //reset background
        this.background = 255;
    }
}


class PlayButton extends Component {
    constructor(context, x, y, w, h) {
        super(context, x, y);
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
        this.text = new Text(this.context, this.x+this.w/2, this.y+this.w*4/5, "Play!", 30);
    }

    mouseHover() {
        this.background = 180;
        this.context.cursor(this.context.HAND);
    }

    getBoundingBox() {
        return this.rect;
    }

    draw() {
        this.context.stroke(0);
        this.context.fill(this.background);
        this.context.rect(...this.rect);
        this.context.triangle(...this.triangle);
        this.text.draw();
        //reset background
        this.background = 255;
    }
}


class Text extends Component {
    constructor(context, x, y, msg, size=30, bold=false, align, font) {
        super(context, x, y);
        this.context = context;
        this.msg = msg;
        this.size = size;
        this.bold = bold;
        this.align = align || this.context.CENTER;
        this.font = font || this.context.NotoSansRegular;
    }

    getBoundingBox() {
        let bbox = this.font.textBounds(this.msg, this.x, this.y,
            this.text_size);
        return [bbox.x, bbox.y, bbox.w, bbox.h];
    }

    updateMsg(msg) {
        this.msg = msg;
    }

    draw() {
        this.context.textFont(this.font);
        this.context.fill(0);
        this.context.textAlign(this.align);
        if (this.bold) 
            this.context.textStyle(this.context.BOLD);
        else 
            this.context.textStyle(this.context.NORMAL);
        this.context.textSize(this.size);
        this.context.text(this.msg, this.x, this.y);
    }
}


class Image extends Component {
    constructor(context, x, y, w, h, src) {
        super(context, x, y);
        this.w = w;
        this.h = h;
        this.src = src;
    }

    getBoundingBox() {
        return [this.x, this.y, this.w, this.h];
    }
}


class Checkbox extends Component {
    constructor(context, x, y, size, checked=false) {
        super(context, x, y);
        this.size = size;
        this.checked = checked;
    }

    getBoundingBox() {
        return [this.x, this.y, this.size, this.size];
    }

    toggle() {}
}


class SignalBox extends Component {
    constructor(context, x, y, d, title) {
        super(context, x, y);
        this.d = d;
        this.text = new Text(this.context, x, y, title, 30, false, this.context.LEFT);
        this.square = [this.x, this.y+30, this.d];
    }

    draw() {
        this.text.draw();
        this.context.noFill();
        this.context.stroke(0);
        this.context.square(...this.square);
    }
}


class PlayerVisual extends Rectangle {
    constructor(context, x, y, w, h) {
        super(context, x, y, w, h);
    }
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


class KeyboardListener {
    constructor(key_code, callback, reset=null) {
        this.key_code = key_code;
        this.callback = callback;
        this.reset = reset;
    }

    update(key_code) {
        if (this.reset !== null)
            this.reset();
        if (key_code === this.key_code) {
            this.callback();
        }
    }
}

const mainSketch = function(p) {
    p.preload = function() {
        p.soundFormats("m4a");
        p.NotoSansRegular = p.loadFont("/assets/NotoSans-Regular.ttf");
        p.NotoSansSymbols2 = p.loadFont("/assets/NotoSansSymbols2-Regular.ttf");
        //p.Batucada120Bpm = p.loadSound("/assets/batucada-120bpm.m4a");
        p.midi_engine = new MidiEngine(p);
    }

    p.setup = function() {
        p.midi_engine.processCsvFiles();

        p.createCanvas(p.windowWidth, p.windowHeight);
        display = new Display(p, p.width, p.height);
        p.textFont(p.NotoSansRegular);
    }

    p.draw = function() {
        p.cursor(p.ARROW);
        display.updateMouseHover(p.mouseX, p.mouseY);
        display.show();
    }

    p.mouseClicked = function() {
        display.updateMouseClick(p.mouseX, p.mouseY);
    }

    p.keyPressed = function() {
        display.updateKeyPress(p.keyCode);
    }
}

new p5(mainSketch);