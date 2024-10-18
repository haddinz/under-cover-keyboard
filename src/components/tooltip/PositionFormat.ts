type PositionFormat = {
  top?(sourceRect: DOMRect, tooltipRect: DOMRect): string | number;
  bottom?(sourceRect: DOMRect, tooltipRect: DOMRect): string | number;
  left?(sourceRect: DOMRect, tooltipRect: DOMRect): string | number;
  right?(sourceRect: DOMRect, tooltipRect: DOMRect): string | number;
}

export default PositionFormat;
