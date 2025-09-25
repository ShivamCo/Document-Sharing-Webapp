const WelcomeSection = ({ user, documentCount }) => {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Document Dashboard</h1>
        <p className="text-blue-100 text-lg">
          Welcome back, <span className="font-semibold text-white">{user?.name}</span>
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm opacity-90">Total Documents</span>
            <div className="text-xl font-bold">{documentCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;