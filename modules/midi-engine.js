export { MidiEngine };


class MidiEngine {
    SURDO_NOTES = {47: "hit", 33: "mute"};
    BAR_DURATION = 1920;
    csv_filenames = {
        "break1": "../assets/csv/break1.csv",
        "batucada_beginning": "../assets/csv/batucada-beginning.csv",
        "batucada_loop": "../assets/csv/batucada-loop.csv",
        "batucada_ending": "../assets/csv/batucada-ending.csv"
    };

    constructor() {
        this.loadCsvFiles();
    }

    loadCsvFiles() {
        this.csv_data = new Object();
        for (let name in this.csv_filenames)
            this.csv_data[name] = loadStrings(this.csv_filenames[name]);
    }

    processCsvFiles() {
        this.sequences = new Object();
        for (let name in this.csv_data)
            this.sequences[name] = this.getNoteSequence(this.csv_data[name]);
    }

    getNoteSequence(csv_array) {
        let data = this.csvArrayToData(csv_array);
        return this.dataToNoteSequence(data);
    }
    
    csvArrayToData(csv_array) {
        let array_data = new Array();
        let line_data;
        for (let line of csv_array) {
            line_data = this.csvLineToData(line);
            array_data.push(line_data);
        }
        return array_data;
    }
    
    csvLineToData(line) {
        let fields = line.match(/\s*(\"[^"]*\"|'[^']*'|[^,]*)\s*(,|$)/g);
        return fields.map(parseValueFromField);
    }
    
    parseValueFromField(field) {
        let m;
    
        //null value
        m = field.match(/^\s*,?$/);
        if (m) return null; 
        // Double Quoted Text
        m = field.match(/^\s*\"([^"]*)\"\s*,?$/);
        if (m) return m[1]; 
        // Single Quoted Text
        m = field.match(/^\s*'([^']*)'\s*,?$/);
        if (m) return m[1];
        // Boolean
        m = field.match(/^\s*(true|false)\s*,?$/);
        if (m) return m[1] === "true" ? true : false;
        // Integer Number
        m = field.match(/^\s*((?:\+|\-)?\d+)\s*,?$/);
        if (m) return parseInt(m[1]);
        // Floating Point Number
        m = field.match(/^\s*((?:\+|\-)?\d*\.\d*)\s*,?$/);
        if (m) return parseFloat(m[1]);
        // Unquoted Text
        m = field.match(/^\s*(.*?)\s*,?$/) 
        if (m) return m[1]; 
        
        return line;
    }
    
    dataToNoteSequence(data) {
        let sequence = new Object();
        sequence.note_values = new Array();
        sequence.note_positions = new Array();
    
        for (let record of data) {
            if (getEvent(record) === "Note_on_c") {
                sequence.note_positions.push(this.getTime(record));
                sequence.note_values.push(this.getNote(record));
            }
        }
    
        return sequence;
    }
    
    getEvent(record) {
        return record[2];
    }
    
    getTime(record) {
        let value = record[1];
        return this.scaleTimeValue(value);
    }
    
    scaleTimeValue(value) {
        return value / this.BAR_DURATION;
    }
    
    getNote(record) {
        let value = record[4];
        return this.SURDO_NOTES[value];
    }
}