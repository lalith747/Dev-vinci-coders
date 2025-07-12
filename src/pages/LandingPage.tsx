import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Users, Award, Leaf, ShoppingBag, Heart } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ItemCard from '../components/ItemCard';

const LandingPage: React.FC = () => {
  const { items, categories } = useData();
  const featuredItems = items.filter(item => item.status === 'available').slice(0, 6);

  const features = [
    {
      icon: Recycle,
      title: 'Sustainable Fashion',
      description: 'Give your clothes a second life and reduce textile waste'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with like-minded people in your area'
    },
    {
      icon: Award,
      title: 'Earn Points',
      description: 'Get rewarded for sharing and discover new styles'
    }
  ];

  const stats = [
    { number: '1,250+', label: 'Items Exchanged' },
    { number: '450+', label: 'Active Members' },
    { number: '85%', label: 'Waste Reduced' },
    { number: '2.3K', label: 'Points Earned' }
  ];

  const howItWorks = [
    {
      icon: <Recycle className="h-10 w-10 text-emerald-600" />,
      title: 'Exchange Your Wardrobe',
      desc: 'Swap your gently used clothing, accessories, and footwear with other members in your area.'
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-600" />,
      title: 'Connect with Community',
      desc: 'Join a vibrant community of fashion enthusiasts who share your passion for sustainability.'
    },
    {
      icon: <Award className="h-10 w-10 text-emerald-600" />,
      title: 'Earn Rewards',
      desc: 'Earn points for every swap, and unlock exclusive discounts and rewards from our partners.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Sustainable Fashion
                <span className="block text-emerald-600">Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Join our community of eco-conscious fashion lovers. Exchange, discover, and give your clothes a second life while building a more sustainable future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-medium rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                >
                  Browse Items
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?w=300&h=400&fit=crop"
                    alt="Sustainable fashion"
                    className="w-full h-48 object-cover rounded-2xl shadow-xl"
                  />
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=300&h=300&fit=crop"
                    alt="Vintage clothing"
                    className="w-full h-36 object-cover rounded-2xl shadow-xl"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=300&h=300&fit=crop"
                    alt="Eco-friendly accessories"
                    className="w-full h-36 object-cover rounded-2xl shadow-xl"
                  />
                  <img
                    src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?w=300&h=400&fit=crop"
                    alt="Sustainable bags"
                    className="w-full h-48 object-cover rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-600">Waste Reduced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How ReWear Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">Join thousands of fashion-forward individuals building a more sustainable wardrobe through community swapping.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative bg-emerald-50 rounded-2xl p-8 pt-14 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-white rounded-full shadow-lg p-4 border-2 border-emerald-100">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-base text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/browse?category=${category.toLowerCase()}`}
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors duration-300"
              >
                <div className="text-center">
                  <div className="p-4 bg-white rounded-xl mb-4 mx-auto w-fit group-hover:shadow-md transition-shadow">
                    <ShoppingBag className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing pieces from our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/browse"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              View All Items
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of fashion lovers building a more sustainable future, one swap at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join ReWear Today
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-medium rounded-xl border-2 border-white hover:bg-white hover:text-emerald-600 transition-all duration-300"
            >
              <Heart className="mr-2 h-5 w-5" />
              Start Browsing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;