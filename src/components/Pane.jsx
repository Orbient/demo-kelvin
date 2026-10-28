// A flat panel one tone above the soot, with a hairline of warm light at its edge. It replaced the liquid
// glass: nothing behind it is re-filtered while the page scrolls.
export default function Pane({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`pane ${className}`.trim()} {...rest}>
      {children === undefined ? null : <div className="pane__in">{children}</div>}
    </Tag>
  );
}
