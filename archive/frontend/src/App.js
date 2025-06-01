import './style.css';

function App() {
  return (
    <div className="main-content">
      {/* Side Panel */}
      <div className="side-panel">
        <h1>PHconsult</h1>
        <ul>
          <li><a href="index.html" className="active"><i className="fas fa-home"></i> <span>Home</span></a></li>
          <li><a href="about.html"><i className="fas fa-info-circle"></i> <span>About Us</span></a></li>
          <li><a href="services.html"><i className="fas fa-concierge-bell"></i> <span>Services</span></a></li>
          <li><a href="contact.html"><i className="fas fa-envelope"></i> <span>Contact</span></a></li>
          <li><a href="login.html"><i className="fas fa-sign-in-alt"></i> <span>Login</span></a></li>
        </ul>
      </div>

      {/* Flyer Banner */}
      <div id="flyer-banner" className="alert alert-info flyer-banner text-center animated-banner" role="alert" style={{marginBottom:0, borderRadius:0, background: 'linear-gradient(90deg, #3a86ff 0%, #00bfae 100%)', color: '#fff', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '1px', boxShadow: '0 2px 8px rgba(58,134,255,0.1)'}}>
        <span className="flyer-message">🌟 Special Offer: Get 20% off your first research consultation with PHconsult! <a href="services.html" className="btn btn-light btn-sm ml-2">Learn More</a></span>
        <button type="button" className="close ml-3" aria-label="Close" onClick={() => {document.getElementById('flyer-banner').style.display='none';}}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      {/* Header */}
      <header className="bg-primary text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="text-light">PHconsult</h1>
          <button className="navbar-toggler d-md-none" type="button" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="dropdown d-none d-md-block">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="themeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Switch Theme
            </button>
            <div className="dropdown-menu" aria-labelledby="themeDropdown">
              <a className="dropdown-item" href="#" id="light-mode">Light Mode</a>
              <a className="dropdown-item" href="#" id="dark-mode">Dark Mode</a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="mobile-menu d-md-none" id="mobileMenu">
        <ul className="list-unstyled">
          <li><a href="index.html" className="active"><i className="fas fa-home"></i> Home</a></li>
          <li><a href="about.html"><i className="fas fa-info-circle"></i> About Us</a></li>
          <li><a href="services.html"><i className="fas fa-concierge-bell"></i> Services</a></li>
          <li><a href="contact.html"><i className="fas fa-envelope"></i> Contact</a></li>
          <li><a href="login.html"><i className="fas fa-sign-in-alt"></i> Login</a></li>
        </ul>
      </div>

      {/* Hero Section */}
      <section className="hero bg-light text-center py-5" style={{backgroundImage: "url('/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="container">
          <h2 className="dynamic-text">Welcome to PHconsult</h2>
          <p className="lead text-white">Your expert partner in research assistance</p>
          <a href="services.html" className="btn btn-primary btn-lg mt-3">Explore Our Services</a>
        </div>
      </section>

      {/* Services Section */}
      <section className="container my-5">
        <div className="text-center">
          <h2>Our Services</h2>
          <p className="lead">We provide comprehensive research support</p>
        </div>
        <div className="row my-4">
          <div className="col-md-4 col-sm-6 col-12 text-center">
            <i className="fas fa-search fa-3x text-primary mb-3"></i>
            <h4>Research Topic Selection</h4>
            <p>We help you choose the right research topic that aligns with your interests and academic goals.</p>
          </div>
          <div className="col-md-4 col-sm-6 col-12 text-center">
            <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
            <h4>Data Analysis</h4>
            <p>We provide thorough analysis using state-of-the-art tools to ensure accuracy and insight in your research.</p>
          </div>
          <div className="col-md-4 col-sm-6 col-12 text-center">
            <i className="fas fa-file-alt fa-3x text-primary mb-3"></i>
            <h4>Report Writing</h4>
            <p>Get professional reports written to meet academic and professional standards, customized to your specifications.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2>What Our Clients Say</h2>
          <div className="row my-4">
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p className="mb-0">PHconsult provided exceptional support for my research project. Highly recommended!</p>
                <footer className="blockquote-footer">John Doe, <cite title="Source Title">PhD Student</cite></footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p className="mb-0">Their data analysis services are top-notch. I couldn't have completed my thesis without their help.</p>
                <footer className="blockquote-footer">Jane Smith, <cite title="Source Title">Master's Student</cite></footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p className="mb-0">Professional and reliable. PHconsult is my go-to for all research-related assistance.</p>
                <footer className="blockquote-footer">Emily Johnson, <cite title="Source Title">Undergraduate Student</cite></footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-title">PHconsult</h5>
              <p className="footer-text">Your trusted partner in professional research assistance. We specialize in data analysis, report writing, and comprehensive research support.</p>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="login.html">Login</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title">Our Services</h5>
              <ul className="footer-links">
                <li><a href="services.html#data-analysis">Data Analysis</a></li>
                <li><a href="services.html#report-writing">Report Writing</a></li>
                <li><a href="services.html#research-consulting">Research Consulting</a></li>
                <li><a href="services.html#topic-selection">Topic Selection</a></li>
                <li><a href="services.html#mentorship">Mentorship</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title">Contact Us</h5>
              <ul className="footer-contact">
                <li><i className="fas fa-envelope"></i> <a href="mailto:phconsultgh@gmail.com">phconsultgh@gmail.com</a></li>
                <li><i className="fas fa-phone"></i> <a href="tel:+0551993820">055 199 3820</a></li>
                <li><i className="fas fa-map-marker-alt"></i> Accra, Ghana</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-0">&copy; 2024 PHconsult. All rights reserved.</p>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="mb-0">Designed with <i className="fas fa-heart text-danger"></i> by PHconsult</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
