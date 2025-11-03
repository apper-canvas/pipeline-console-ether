import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pipelineValue: 0,
    closeRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const [contacts, deals] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);

      const activeDeals = deals.filter(deal => deal.status === "active");
      const wonDeals = deals.filter(deal => deal.status === "won");
      const totalDeals = deals.length;
      const pipelineValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const closeRate = totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0;

      setStats({
        totalContacts: contacts.length,
        activeDeals: activeDeals.length,
        pipelineValue,
        closeRate
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loading variant="stats" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        onMenuClick={onMenuClick}
      />
      
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon="Users"
            gradient="blue"
            delay={0}
          />
          <StatsCard
            title="Active Deals"
            value={stats.activeDeals}
            icon="Target"
            gradient="green"
            delay={0.1}
          />
          <StatsCard
            title="Pipeline Value"
            value={formatCurrency(stats.pipelineValue)}
            icon="DollarSign"
            gradient="purple"
            delay={0.2}
          />
          <StatsCard
            title="Close Rate"
            value={`${stats.closeRate}%`}
            icon="TrendingUp"
            gradient="orange"
            delay={0.3}
          />
        </div>

        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Welcome to Pipeline Pro</h2>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              Your complete sales CRM solution. Track contacts, manage deals through your sales pipeline, 
              and grow your business with powerful insights and streamlined workflows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">{stats.totalContacts}</span>
                </div>
                <p className="text-blue-100">Contacts Managed</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">{stats.activeDeals}</span>
                </div>
                <p className="text-blue-100">Active Deals</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">{stats.closeRate}%</span>
                </div>
                <p className="text-blue-100">Success Rate</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Call</h3>
                <p className="text-sm text-secondary">Connect with your contacts</p>
              </div>
            </div>
            <p className="text-sm text-secondary">
              Stay connected with your pipeline. Regular communication drives deals forward.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Campaign</h3>
                <p className="text-sm text-secondary">Nurture your leads</p>
              </div>
            </div>
            <p className="text-sm text-secondary">
              Keep your prospects engaged with targeted email sequences and follow-ups.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pipeline Review</h3>
                <p className="text-sm text-secondary">Analyze your progress</p>
              </div>
            </div>
            <p className="text-sm text-secondary">
              Review deal stages, identify bottlenecks, and optimize your sales process.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;