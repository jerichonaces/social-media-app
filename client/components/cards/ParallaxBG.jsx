const ParallaxBG = ({ url, children = 'PJConnect' }) => {
  return (
    <div
      className='container-fluid'
      style={{
        backgroundImage: 'url(' + url + ')',
        backgroundAttachment: 'fixed',
        padding: '100px 0px 75px 0px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'block',
      }}
    >
      <h1 className='display-1 fw-bold text-center text-light'>{children}</h1>
    </div>
  );
};

export default ParallaxBG;
