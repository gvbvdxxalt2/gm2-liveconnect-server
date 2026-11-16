
class Variable {
    static createVariable({name, value}) {
        return new Variable(name, value);
    }

    static LOCK_MODE_UNLOCKED () {
        return 0;
    }
    static LOCK_MODE_LOCKED_CLIENTS () {
        return 1;
    }
    static LOCK_MODE_LOCKED_SERVER () {
        return 2;
    }

    constructor (name, initialValue) {
        this.locked = 0;
        this.name = name;

        this.value = initialValue;
    }

    set(value) {
        if (this.locked > 0) {
            return;
        }
        this.value = value;
    }
    setServer(value) {
        if (this.locked > 1) {
            return;
        }
        this.value = value;
    }

    getValue () {
        if (this.locked > 2) {
            return null;
        }
        return this.value;
    }

    dispose() {
        this.value = 0;
        delete this.value;
        this.locked = 3;

    }
}

module.exports = Variable;