var AMOUNT_DIAMONDS = 30
GamePlayManager = {
    //Inicializar variables
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        game.scale.pageAlignHorizontally = true
        game.scale.pageAlignVertically = true
        this.flagFirstMouseDown = false
    },
    //Cargar todos los recurso del proyecto(assets)
    preload: function() {
        game.load.crossOrigin = 'anonymous'
        game.load.image('background', "https://image.ibb.co/doYQ67/background.png")
        game.load.spritesheet('horse', "https://image.ibb.co/itLSKS/horse.png", 84, 156, 2)
        game.load.spritesheet('diamonds', "https://image.ibb.co/iX6Jdn/diamonds.png", 81, 84, 4)
        game.load.image('explosion', "https://image.ibb.co/fgPh4S/explosion.png")
    },
    //Utilizar los recursos previamente cargados
    create: function() {
        game.add.sprite(0, 0, 'background')
        this.horse = game.add.sprite(0, 0, 'horse')
        this.horse.frame = 0
        this.horse.x = game.width / 2
        this.horse.y = game.height / 2
        this.horse.anchor.setTo(0)
            /*this.horse.angle = 0
            this.horse.scale.setTo(1, 2)
            this.horse.alpha = 0.2*/
        game.input.onDown.add(this.onTap, this)

        this.diamond = []
        for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
            var diamonds = game.add.sprite(100, 100, 'diamonds')
            diamonds.frame = game.rnd.integerInRange(0, 3)
            diamonds.scale.setTo(0.30 + game.rnd.frac())
            diamonds.anchor.setTo(0.5)
            diamonds.x = game.rnd.integerInRange(50, 1050)
            diamonds.y = game.rnd.integerInRange(50, 600)
            this.diamond[i] = diamonds
            var rectCurrentDiamond = this.getBoundsDiamond(diamonds)
            var rectCurrentHorse = this.getBoundsDiamond(this.horse)
            while (this.isOverLappingDiamond(i, rectCurrentDiamond) ||
                this.isRectangleOverLapping(rectCurrentHorse, rectCurrentDiamond)) {
                diamonds.x = game.rnd.integerInRange(50, 1050)
                diamonds.y = game.rnd.integerInRange(50, 600)
                rectCurrentDiamond = this.getBoundsDiamond(diamonds)
            }
        }
        this.explosion = game.add.sprite(100, 100, 'explosion')
        this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
            x: [0.4, 0.8, 0.4],
            y: [0.4, 0.8, 0.4]
        }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false)
        this.explosion.tweenAlpha = game.add.tween(this.explosion.scale).to({
            alpha: [0.4, 0.8, 0.4]
        }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false)
        this.explosion.anchor.setTo(0.5)
        this.explosion.visible = false
            /*var tween = game.add.tween(this.explosion)
            tween.to({ x: 500, y: 100 }, 1500, Phaser.Easing.Exponential.Out)
            tween.start()*/

    },
    onTap: function() {
        this.flagFirstMouseDown = true
    },
    getBoundsDiamond: function(currentDiamond) {
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width,
            currentDiamond.height)
    },
    isRectangleOverLapping: function(rect1, rect2) {
        if (rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width) {
            return false
        }
        if (rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height) {
            return false
        }
        return true
    },
    isOverLappingDiamond: function(index, rect2) {
        for (var i = 0; i < index; i++) {
            var rect1 = this.getBoundsDiamond(this.diamond[i])
            if (this.isRectangleOverLapping(rect1, rect2)) {
                return true
            }
        }
        return false
    },
    getBoundsHorse: function() {
        var x0 = this.horse.x - Math.abs(this.horse.width) / 4
        var width = Math.abs(this.horse.width)
        var y0 = this.horse.y - this.horse.height / 2
        var height = this.horse.height

        return new Phaser.Rectangle(x0, y0, width, height)
    },
    /*render: function() {
        game.debug.spriteBounds(this.horse)
        for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
            game.debug.spriteBounds(this.diamond[i])
        }
    },*/
    update: function() {
        if (this.flagFirstMouseDown) {
            var pointerX = game.input.x
            var pointerY = game.input.y
                // console.log('x: ' + pointerX + '\ny: ' + pointerY)
            var distX = pointerX - this.horse.x
            var distY = pointerY - this.horse.y

            if (distX > 0) {
                this.horse.scale.setTo(1, 1)
            } else {
                this.horse.scale.setTo(-1, 1)
            }
            this.horse.x += distX * 0.12
            this.horse.y += distY * 0.12

            for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
                var rectHorse = this.getBoundsHorse()
                var rectDiamond = this.getBoundsDiamond(this.diamond[i])
                if (this.diamond[i].visible && this.isRectangleOverLapping(rectHorse, rectDiamond)) {
                    this.diamond[i].visible = false

                    this.explosion.visible = true
                    this.explosion.x = this.diamond[i].x
                    this.explosion.y = this.diamond[i].y
                    this.explosion.tweenScale.start()
                    this.explosion.tweenAlpha.start()
                }
            }
        }

    }
}


// Instancia de Phaser
/*
Phaser.WEBGL -> Implementación gráfica que nos permetiría utilizar la tarjeta de vídeo de nuestro computador, por ende, el render es muy rápido
Phaser.CANVAS -> Se útiliza en el caso de que no se pueda contar con una tarjeta de vídeo, el render es mucho mas lento
Phaser.AUTO -> Phaser intenta útilizar Phaser.WEBGL y en dado caso que no cuente con una tarjeta de vídeo útiliza Phaser.CANVAS
*/
//------------------------width, height, (Phaser.WEBGL,Phaser.CANVAS, Phaser.AUTO)
var game = new Phaser.Game(1136, 640, Phaser.AUTO)

//Agregarle un estado a la instancia de game
game.state.add('gameplay', GamePlayManager)

//Un juego phaser puede tener multiples estados, en este caso vamos a ejecutar el estado start
game.state.start('gameplay')