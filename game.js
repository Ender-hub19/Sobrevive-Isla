const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: +IBg-game-container+IBk-,
  physics: { default: +IBg-arcade+IBk-, arcade: { gravity: { y: 0 } } },
  scene: [BootScene, GameScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);

class BootScene extends Phaser.Scene {
  constructor() { super(+IBk-Boot+IBk-); }
  preload() {
    this.load.image(+IBk-tiles+IBk, +IBg-https://labs.phaser.io/assets/games/survival/tiles.png+IBk-);
    this.load.tilemapTiledJSON(+IBk-map+IBk, +IBg-https://labs.phaser.io/assets/games/survival/map.json+IBk-);
    this.load.atlas(+IBk-player+IBk, +IBg-https://labs.phaser.io/assets/games/survival/player.png+IBk, +IBg-https://labs.phaser.io/assets/games/survival/player.json+IBk-);
    this.load.image(+IBk-wood+IBk, +IBg-https://labs.phaser.io/assets/sprites/wood.png+IBk-);
    this.load.image(+IBk-food+IBk, +IBg-https://labs.phaser.io/assets/sprites/apple.png+IBk-);
    this.load.image(+IBk-water+IBk, +IBg-https://labs.phaser.io/assets/sprites/water.png+IBk-);
    this.load.spritesheet(+IBk-wolf+IBk, +IBg-https://labs.phaser.io/assets/sprites/wolf.png+IBk-, { frameWidth: 32, frameHeight: 32 });
    this.load.audio(+IBk-bgm+IBk, +IBg-https://labs.phaser.io/assets/audio/oedipus_wizball.xm+IBk-);
  }
  create() { this.scene.start(+IBk-Game+IBk-); }
}

class GameScene extends Phaser.Scene {
  constructor() { super(+IBk-Game+IBk-); }
  create() {
    this.cameras.main.setBackgroundColor(+IBk#87CEEB+IBk-);
    this.inventory = [];
    this.cycle = 0;
    this.day = 1;
    this.playerHealth = 100;
    this.hunger = 100;
    this.thirst = 100;

    const map = this.make.tilemap({ key: +IBg-map+IBk- });
    const tileset = map.addTilesetImage(+IBk-tiles+IBk-);
    map.createLayer(+IBk-Ground+IBk-, tileset);
    map.createLayer(+IBk-Trees+IBk,+IBk-, tileset);

    this.player = this.physics.add.sprite(400, 300, +IBg-player+IBk, +IBg-walk_000.png+IBk-);
    this.player.setCollideWorldBounds(true);
    this.anims.create({ key: +IBg-walk+IBk, frames: this.anims.generateFrameNames(+IBk-player+IBk, { prefix: +IBg-walk_+IBk, start: 0, end: 7, suffix: +IBg.png+IBk- }), frameRate: 10, repeat: -1 });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: +IBg-W+IBk, left: +IBg-A+IBk, down: +IBg-S+IBk, right: +IBg-D+IBk- });

    this.add.text(10, 10, +IBg-D+AO0-a 1 | Salud: 100 | Hambre: 100 | Sed: 100+IBk, { font: +IBg-16px Arial+IBk, color: +IBg#000+IBk- }).setScrollFactor(0);

    this.time.addEvent({ delay: 60000, callback: this.nextHour, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 10000, callback: this.spawnResource, callbackScope: this, loop: true });
  }

  nextHour() {
    this.cycle = (this.cycle +- 1) % 24;
    if (this.cycle === 0) this.day+-+-;
    this.hunger = Math.max(0, this.hunger - 5);
    this.thirst = Math.max(0, this.thirst - 7);
    if (this.cycle >= 18 || this.cycle < 6) {
      this.cameras.main.setBackgroundColor(+IBk#000033+IBk-);
      this.spawnEnemy();
    } else {
      this.cameras.main.setBackgroundColor(+IBk#87CEEB+IBk-);
    }
  }

  spawnResource() {
    const types = [+IBk-wood+IBk, +IBg-food+IBk, +IBg-water+IBk-];
    const type = Phaser.Math.RND.pick(types);
    const x = Phaser.Math.Between(100, 1900);
    const y = Phaser.Math.Between(100, 1900);
    const item = this.physics.add.sprite(x, y, type).setInteractive();
    item.on(+IBk-pointerdown+IBk-, () => {
      if (this.inventory.length < 9) {
        this.inventory.push(type);
        item.destroy();
      }
    });
  }

  spawnEnemy() {
    const wolf = this.physics.add.sprite(Phaser.Math.Between(100, 1900), Phaser.Math.Between(100, 1900), +IBg-wolf+IBk-, 0);
    this.physics.moveToObject(wolf, this.player, 60);
  }

  update() {
    const speed = 160;
    this.player.setVelocity(0);
    if (this.cursors.left.isDown || this.wasd.left.isDown) this.player.setVelocityX(-speed);
    if (this.cursors.right.isDown || this.wasd.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown || this.wasd.up.isDown) this.player.setVelocityY(-speed);
    if (this.cursors.down.isDown || this.wasd.down.isDown) this.player.setVelocityY(speed);

    this.player.anims.play(+IBk-walk+IBk-, true);
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) this.player.anims.stop();
  }
}
