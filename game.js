let game = {

    apps: [
        'torror',
        'surpresa',
        'simpaz',
        'riso',
        'leao',
        'fogo',
        'donalt',
        'Coroa',
        'amor',
        'madre',
        'olho',
        'fantasma',
        'caveira',
        'aranha',
        'monstro'
    ],

    cards: [],

    difficulties: {

        easy: {
            name: "FÁCIL",
            pairs: 8,
            time: 120
        },

        normal: {
            name: "NORMAL",
            pairs: 10,
            time: 90
        },

        nightmare: {
            name: "PESADELO",
            pairs: 15,
            time: 60
        }

    },

    currentDifficulty: "normal",

    createCards: function () {

        const settings =
            this.difficulties[this.currentDifficulty];

        const selectedApps =
            this.apps.slice(0, settings.pairs);

        this.cards = [];

        selectedApps.forEach((app) => {

            const pair = this.createPair(app);

            this.cards.push(...pair);

        });

        return this.cards;

    },


    createPair: function (app) {

        return [

            {
                id: this.createID(app),
                icon: app,
                flipped: false,
                matched: false
            },

            {
                id: this.createID(app),
                icon: app,
                flipped: false,
                matched: false
            }

        ];

    },


    createID: function (app) {

        return (
            app +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    },


    shuffleCards: function (cards) {

        let currentIndex = cards.length;

        while (currentIndex > 0) {

            const randomIndex =
                Math.floor(
                    Math.random() * currentIndex
                );

            currentIndex--;

            [
                cards[currentIndex],
                cards[randomIndex]
            ] = [
                cards[randomIndex],
                cards[currentIndex]
            ];

        }

        return cards;

    },


    setDifficulty: function (level) {

        if (this.difficulties[level]) {

            this.currentDifficulty = level;

        }

    },


    getDifficulty: function () {

        return this.difficulties[
            this.currentDifficulty
        ];

    }

};