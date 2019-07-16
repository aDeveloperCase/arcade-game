var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;
        
    canvas.width = IMGS.width * 5;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // loading resources
    Resources.load(IMGS.indexList);
    Resources.onReady(init);

    global.ctx = ctx;

    function init() {
        main();
    }

    function main() {
        
        render();
        update();
        win.requestAnimationFrame(main);
    }

    function update() {
        scene.update();
    }

    function render() {

        scene.render();
    }

    function reset() {
        // noop
    }
})(this);
