class BorderPainter {
  static get inputProperties() {
    return [
      "--border-color",
      "--background-color",
      "--border-width",
      "--border-radius",
      "--corner-style",
      "--side-inset",
      "--side-style",
    ];
  }

  parseList(list) {
    return [
      list[0],
      list[1] || list[0],
      list[2] || list[0],
      list[3] || list[1] || list[0],
    ];
  }

  paint(ctx, geom, props) {
    // Use `ctx` as if it was a normal canvas
    const borderRadii = this.parseList(props.getAll("--border-radius")).map(
      (item) => item.value
    );
    const borderWidth = props.get("--border-width").value;
    const cornerStyles = this.parseList(
      props.get("--corner-style")[0].split(" ")
    );

    const sideInsets = this.parseList(props.getAll("--side-inset")).map(
      (item) => item.value
    );
    const sideStyles = this.parseList(props.get("--side-style")[0].split(" "));

    ctx.beginPath();

    const corners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];

    const scale = (corner) => ({
      x: corner.x * geom.width + ((1 - corner.x * 2) * borderWidth) / 2,
      y: corner.y * geom.height + ((1 - corner.y * 2) * borderWidth) / 2,
    });

    for (let i = 0; i < corners.length; i++) {
      const previousCorner = corners[(i + corners.length - 1) % corners.length];
      const currentCorner = corners[i];
      const nextCorner = corners[(i + 1) % corners.length];

      this.drawCorner(
        ctx,
        scale(currentCorner),
        previousCorner.x + nextCorner.x - 2 * currentCorner.x,
        previousCorner.y + nextCorner.y - 2 * currentCorner.y,
        borderRadii[i],
        cornerStyles[i]
      );

      this.drawSide(
        ctx,
        scale(currentCorner),
        scale(nextCorner),
        nextCorner.x - currentCorner.x,
        nextCorner.y - currentCorner.y,
        borderRadii[i],
        borderRadii[(i + 1) % corners.length],
        sideInsets[i],
        sideStyles[i]
      );
    }

    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.fillStyle = props.get("--background-color");
    ctx.fill();
    ctx.strokeStyle = props.get("--border-color");
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  drawSide(
    ctx,
    startCorner,
    endCorner,
    dx,
    dy,
    startBorderRadius,
    endBorderRadius,
    sideInset,
    sideStyle
  ) {
    const start = {
      x: startCorner.x + dx * startBorderRadius,
      y: startCorner.y + dy * startBorderRadius,
    };

    const end = {
      x: endCorner.x - dx * endBorderRadius,
      y: endCorner.y - dy * endBorderRadius,
    };

    const inset = {
      x: -sideInset * dy,
      y: sideInset * dx,
    };

    const startMid = {
      x: start.x + dx * sideInset,
      y: start.y + dy * sideInset,
    };

    const endMid = {
      x: end.x - dx * sideInset,
      y: end.y - dy * sideInset,
    };

    const n = Math.abs(dx + dy - 1) + Math.abs(dy);

    switch (sideStyle) {
      case "inset":
        ctx.lineTo(start.x + inset.x, start.y + inset.y);
        ctx.lineTo(end.x + inset.x, end.y + inset.y);
        ctx.lineTo(end.x, end.y);
        break;

      case "rounded":
        ctx.arc(
          startMid.x,
          startMid.y,
          sideInset,
          ((n + 2) * Math.PI) / 2,
          ((n + 1) * Math.PI) / 2,
          true
        );
        ctx.lineTo(endMid.x + inset.x, endMid.y + inset.y);
        ctx.arc(
          endMid.x,
          endMid.y,
          sideInset,
          ((n + 1) * Math.PI) / 2,
          ((n + 0) * Math.PI) / 2,
          true
        );
        break;

      case "bevel":
        ctx.lineTo(startMid.x + inset.x, startMid.y + inset.y);
        ctx.lineTo(endMid.x + inset.x, endMid.y + inset.y);
        ctx.lineTo(end.x, end.y);
        break;

      default:
        ctx.lineTo(end.x, end.y);
    }
  }

  drawCorner(ctx, corner, dx, dy, borderRadius, cornerStyle) {
    const mid = {
      x: corner.x + dx * borderRadius,
      y: corner.y + dy * borderRadius,
    };
    const end = {
      x: corner.x + ((dy + dx) / 2) * borderRadius,
      y: corner.y + ((dy - dx) / 2) * borderRadius,
    };
    const n = Math.abs(dx + dy) / 2 + (dx + 1);

    switch (cornerStyle) {
      case "rounded":
        ctx.arc(
          mid.x,
          mid.y,
          borderRadius,
          ((n - 1) * Math.PI) / 2,
          (n * Math.PI) / 2
        );
        break;

      case "scoop":
        ctx.arc(
          corner.x,
          corner.y,
          borderRadius,
          ((n + 2) * Math.PI) / 2,
          ((n + 1) * Math.PI) / 2,
          true
        );
        break;

      case "notch":
        ctx.lineTo(mid.x, mid.y);
        ctx.lineTo(end.x, end.y);
        break;

      case "bevel":
        ctx.lineTo(end.x, end.y);
        break;

      default:
        ctx.lineTo(corner.x, corner.y);
        ctx.lineTo(end.x, end.y);
    }
  }
}

registerPaint("fancy-border", BorderPainter);
