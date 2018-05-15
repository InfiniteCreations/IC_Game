requirejs({
    baseUrl: '',
    paths: {
        Core: 'assets/js/core',
        Scripts: 'assets/js/core/scripts',
        _pc: 'assets/js/playcanvas-stable.min',
        pc: 'assets/js/playcanvas-stable'
    }
})


requirejs(['Core/InfiniteCreations'], function (InfiniteCreations) {

    new InfiniteCreations();

})