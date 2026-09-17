import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <h1>Personalized Nutrition,<br /><span>For Your Needs.</span></h1>
      <p>Healthy, chef-prepared meals and snacks designed for medical diets, elderly care, and busy professionals. Delivered fresh.</p>
      <button className="cta-btn" onClick={() => navigate('/menu')}>View Diet Menu</button>
    </section>
  );
}
