export default function Loading() {
  return (
    <div style={overlayStyle}>
      <div>Loading...</div>
    </div>
  );
}

const overlayStyle = {
  padding: '16px',
  textAlign: 'center',
  fontSize: '18px'
};
