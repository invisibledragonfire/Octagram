class RuneSmith {
  static get inputProperties() {
    return ["--rune-value"];
  }

  parseRune(runeValue) {}

  paint(ctx, geom, props) {
    // Use `ctx` as if it was a normal canvas

    ctx.beginPath();

    this.drawNGon(ctx, geom, 3 + Math.floor(Math.random() * 3));

    ctx.closePath();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawNGon(ctx, geom, n) {
    const points = [];
    for (let i = 1; i <= n; i++) {
      points.push({
        x:
          geom.width * 0.5 + geom.width * 0.4 * Math.sin((2 * Math.PI * i) / n),
        y:
          geom.height * 0.5 +
          geom.height * 0.4 * Math.cos((2 * Math.PI * i) / n),
      });
    }

    for (const point of points) {
      ctx.lineTo(point.x, point.y);
    }
  }
}

registerPaint("rune-smith", RuneSmith);
