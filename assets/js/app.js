requirejs({
    baseUrl: '',
    paths: {
        Core: 'assets/js/core',
        THREE: 'assets/js/three.min'
    }
})


requirejs(['Core/InfiniteCreations'], function (InfiniteCreations) {

    new InfiniteCreations();
})