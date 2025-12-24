export default function ErrorView({ message }) {
  return (
    <div style={style}>
      <h3>Error</h3>
      <p>{message}</p>
    </div>
  );
}

const style = {
  padding: '16px',
  color: 'red'
};
