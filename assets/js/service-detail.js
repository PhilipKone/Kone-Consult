// Service details data
const services = {
  "data-analysis": {
    title: "Data Analysis",
    icon: '<i class="fas fa-chart-line fa-4x text-primary"></i>',
    description: "We provide thorough analysis using state-of-the-art tools to ensure accuracy and insight in your research. Our experts handle quantitative and qualitative data, delivering actionable results.",
    features: [
      "Statistical analysis (SPSS, R, Python, Excel)",
      "Data cleaning and preprocessing",
      "Visualization and reporting",
      "Interpretation of results",
      "Custom analysis to fit your project needs"
    ],
    image: "assets/images/data-analysis.jpg",
    testimonials: [
      {
        quote: "The data analysis provided was thorough and easy to understand. It made a huge difference in my research!",
        author: "- Ama K., Graduate Student"
      },
      {
        quote: "Professional, timely, and insightful. Highly recommend their data services.",
        author: "- Dr. Mensah, Researcher"
      }
    ]
  },
  "report-writing": {
    title: "Report Writing",
    icon: '<i class="fas fa-file-alt fa-4x text-success"></i>',
    description: "Get professional reports written to meet academic and professional standards, customized to your specifications. Our team ensures clarity, structure, and impactful presentation.",
    features: [
      "Academic and professional report writing",
      "Editing and proofreading",
      "Formatting to required guidelines (APA, MLA, etc.)",
      "Plagiarism checking and originality assurance",
      "Fast turnaround and revisions included"
    ],
    image: "assets/images/report-writing.jpg",
    testimonials: [
      {
        quote: "My report was accepted without any corrections. The writing was clear and well-organized!",
        author: "- Kojo A., MBA Student"
      }
    ]
  },
  "research-consulting": {
    title: "Research Consulting",
    icon: '<i class="fas fa-lightbulb fa-4x text-warning"></i>',
    description: "Our expert team offers consulting to guide your research process, from idea formulation to final output. We provide tailored advice to maximize your research impact.",
    features: [
      "One-on-one research guidance",
      "Project planning and methodology advice",
      "Data interpretation and troubleshooting",
      "Support from proposal to publication",
      "Confidential and ethical consulting"
    ],
    image: "assets/images/research-consulting.jpg",
    testimonials: [
      {
        quote: "The consulting sessions helped me clarify my research direction and avoid costly mistakes.",
        author: "- Nana B., PhD Candidate"
      }
    ]
  },
  "topic-selection": {
    title: "Research Topic Selection",
    icon: '<i class="fas fa-search fa-4x text-info"></i>',
    description: "We help you choose the right research topic that aligns with your interests and academic goals. Our team provides guidance to ensure your topic is relevant, feasible, and impactful.",
    features: [
      "Personalized topic brainstorming",
      "Alignment with academic/professional goals",
      "Feasibility and resource assessment",
      "Literature review support",
      "Proposal drafting assistance"
    ],
    image: "assets/images/topic-selection.jpg",
    testimonials: [
      {
        quote: "I was struggling to choose a topic, but their team made the process easy and stress-free!",
        author: "- Efua S., Undergraduate"
      }
    ]
  },
  "mentorship": {
    title: "Mentorship and Ongoing Support",
    icon: '<i class="fas fa-hands-helping fa-4x text-secondary"></i>',
    description: "Receive continuous guidance and support throughout your research journey. Our mentorship program ensures you never feel lost, providing expert advice and encouragement every step of the way.",
    features: [
      "Regular check-ins and progress tracking",
      "Personalized advice and feedback",
      "Access to expert mentors",
      "Motivation and accountability support",
      "Resources and networking opportunities"
    ],
    image: "assets/images/mentorship.jpg",
    testimonials: [
      {
        quote: "The mentorship kept me motivated and on track. I couldn't have finished my thesis without their support!",
        author: "- Kofi O., MPhil Student"
      }
    ]
  },
  "assignment-support": {
    title: "Assignment Support",
    icon: '<i class="fas fa-book fa-4x text-danger"></i>',
    description: "Get assistance with your academic assignments to ensure high-quality submissions. Our experts provide guidance, editing, and feedback to help you excel in your coursework.",
    features: [
      "Assignment review and editing",
      "Guidance on structure and content",
      "Plagiarism checking and citation help",
      "Support for various subjects and levels",
      "Timely feedback and revisions"
    ],
    image: "assets/images/assignment-support.jpg",
    testimonials: [
      {
        quote: "Their feedback on my assignments helped me improve my grades significantly!",
        author: "- Yaw D., College Student"
      }
    ]
  }
};

// Helper to get URL parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Render service details
function renderServiceDetail() {
  const key = getQueryParam('service');
  const service = services[key];
  if (!service) {
    document.getElementById('service-detail').innerHTML = '<div class="alert alert-danger">Service not found.</div>';
    return;
  }
  document.getElementById('service-title').textContent = service.title;
  document.getElementById('service-icon').innerHTML = service.icon;
  document.getElementById('service-description').textContent = service.description;
  // Features
  if (service.features && service.features.length) {
    const ul = document.createElement('ul');
    ul.className = 'list-group mb-3';
    service.features.forEach(f => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = f;
      ul.appendChild(li);
    });
    document.getElementById('service-features').innerHTML = '<h5>Key Features</h5>';
    document.getElementById('service-features').appendChild(ul);
  }
  // Image
  const img = document.getElementById('service-image');
  if (service.image) {
    img.src = service.image;
    img.alt = service.title + ' image';
  } else {
    img.src = 'assets/images/service-placeholder.jpg';
    img.alt = 'Service Image';
  }
  // Testimonials
  const testimonialList = document.getElementById('testimonial-list');
  testimonialList.innerHTML = '';
  if (service.testimonials && service.testimonials.length) {
    service.testimonials.forEach(t => {
      const block = document.createElement('blockquote');
      block.className = 'blockquote';
      block.innerHTML = `<p class="mb-1">${t.quote}</p><footer class="blockquote-footer">${t.author}</footer>`;
      testimonialList.appendChild(block);
    });
  } else {
    testimonialList.innerHTML = '<div class="text-muted">No testimonials available yet.</div>';
  }
}

document.addEventListener('DOMContentLoaded', renderServiceDetail);
