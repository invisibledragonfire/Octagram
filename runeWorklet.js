class RuneSmith {
  static get inputProperties() {
    return ["--rune-value", "--rune-color"];
  }

  sides;
  points;
  nodes;
  dots;
  runeValue;

  parseRune(runeValue) {
    this.nodes = [];
    this.sides = 0;
    this.dots = [];
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
        this.dots.push(0);
        i++;
        this.sides++;
      } else {
        this.nodes.push(false);
        this.dots[this.dots.length - 1]++;
      }
    });
  }

  paint(ctx, geom, props) {
    // Use `ctx` as if it was a normal canvas

    const runeColor = props.get("--rune-color") || "black";

    this.runeValue = props.get("--rune-value").value;
    this.parseRune(this.runeValue);

    this.generatePoints(geom, this.sides || 3 + Math.floor(Math.random() * 3));

    ctx.strokeStyle = runeColor;
    ctx.lineWidth = 2;

    this.drawLines(ctx);

    this.drawDots(ctx, geom);
  }

  generatePoints(geom, n) {
    this.points = [];
    for (let i = 1; i <= n; i++) {
      this.points.push({
        x:
          geom.width * 0.5 + geom.width * 0.3 * Math.sin((2 * Math.PI * i) / n),
        y:
          geom.height * 0.5 +
          geom.height * 0.3 * Math.cos((2 * Math.PI * i) / n),
      });
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
          ctx.stroke();
        }

        i++;
      }
    }
  }

  drawDots(ctx, geom) {
    if (this.sides === 0) {
      this.generatePoints(geom, 8);
      for (let point of this.points) {
        this.renderDot(ctx, point);
      }
      return;
    }

    for (let a = 0; a < this.dots.length; a++) {
      if (!!this.dots[a]) {
        this.renderDots(ctx, geom, a, this.dots[a]);
      }
    }
  }

  renderDots(ctx, geom, sideNumber, dotNumber) {
    const startPoint = this.points[sideNumber];
    const endPoint = this.points[(sideNumber + 1) % this.points.length];
    const midPoint = {
      x: geom.width * 0.5,
      y: geom.height * 0.5,
    };
    const sideMidPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    };

    let factor = 0.4;
    if (this.sides === 3) {
      factor = 0.6;
    }

    let verticalOffset = {
      x: factor * (sideMidPoint.x - midPoint.x),
      y: factor * (sideMidPoint.y - midPoint.y),
    };
    if (this.sides === 2) {
      verticalOffset = {
        x: factor * (startPoint.y - midPoint.x),
        y: factor * (startPoint.x - midPoint.y),
      };
    }

    const horizontalOffset = {
      x: -verticalOffset.y,
      y: verticalOffset.x,
    };

    if (dotNumber === 1) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x,
        y: sideMidPoint.y + verticalOffset.y,
      });
    } else if (dotNumber === 2) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y - horizontalOffset.y / 2,
      });
    } else if (dotNumber === 3) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y - horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2,
        y: sideMidPoint.y + verticalOffset.y * 2,
      });
    } else if (dotNumber === 4) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y - horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 - horizontalOffset.y / 2,
      });
    } else if (dotNumber === 5) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x,
        y: sideMidPoint.y + verticalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x + horizontalOffset.x,
        y: sideMidPoint.y + verticalOffset.y + horizontalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x - horizontalOffset.x,
        y: sideMidPoint.y + verticalOffset.y - horizontalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 - horizontalOffset.y / 2,
      });
    } else if (dotNumber === 6) {
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x,
        y: sideMidPoint.y + verticalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x + horizontalOffset.x,
        y: sideMidPoint.y + verticalOffset.y + horizontalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x - horizontalOffset.x,
        y: sideMidPoint.y + verticalOffset.y - horizontalOffset.y,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 + horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 + horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 2 - horizontalOffset.x / 2,
        y: sideMidPoint.y + verticalOffset.y * 2 - horizontalOffset.y / 2,
      });
      this.renderDot(ctx, {
        x: sideMidPoint.x + verticalOffset.x * 3,
        y: sideMidPoint.y + verticalOffset.y * 3,
      });
    }
  }

  renderDot(ctx, point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, true);
    ctx.stroke();
  }
}

registerPaint("rune-smith", RuneSmith);
