class RuneSmith {
  static get inputProperties() {
    return ["--rune-value"];
  }

  sides;
  points;
  nodes;
  runeValue;

  parseRune(runeValue) {
    this.nodes = [];
    this.sides = 0;
    let i = 1;
    [
      127, // all connections to 1
      8065, // all connections to 2
      254082, // all connections to 3
      3940612, // all connections to 4
      29639176, // all connections to 5
      105415696, // all connections to 6
      177276960, // all connections to 7
      220336192, // all connections to 8
    ].forEach((nodeConnections) => {
      if ((runeValue & nodeConnections) !== 0) {
        this.nodes.push(i);
        i++;
        this.sides++;
      } else {
        this.nodes.push(false);
      }
    });
  }

  paint(ctx, geom, props) {
    // Use `ctx` as if it was a normal canvas

    this.runeValue = props.get("--rune-value").value;
    this.parseRune(this.runeValue); // TODO remove check

    this.generatePoints(geom, this.sides || 3 + Math.floor(Math.random() * 3));

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    this.drawLines(ctx); // TODO remove check
  }

  generatePoints(geom, n) {
    this.points = [];
    for (let i = 1; i <= n; i++) {
      this.points.push({
        x:
          geom.width * 0.5 + geom.width * 0.4 * Math.sin((2 * Math.PI * i) / n),
        y:
          geom.height * 0.5 +
          geom.height * 0.4 * Math.cos((2 * Math.PI * i) / n),
      });
    }
  }

  drawNGon(ctx) {
    for (const point of this.points) {
      ctx.beginPath();
      ctx.lineTo(point.x, point.y);
      ctx.closePath();
      ctx.stroke();
    }
  }

  drawLines(ctx) {
    let i = 0;
    for (let a = 0; a <= 6; a++) {
      for (let b = a + 1; b <= 7; b++) {
        if (this.runeValue & (1 << i)) {
          const startPoint = this.points[this.nodes[a] - 1];
          const endPoint = this.points[this.nodes[b] - 1];

          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.closePath();
          ctx.stroke();
        }

        i++;
      }
    }
  }
}

registerPaint("rune-smith", RuneSmith);
