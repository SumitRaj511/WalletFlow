import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [data, setData] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netBalance: 0,
    healthScore: 100,
    recentTransactions: [],
    upcomingBills: [],
    goals: []
  });

  const [loading, setLoading] = useState(true);

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  // Form states
  const [incomeInput, setIncomeInput] = useState('');
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'Food & Dining', description: '', paymentMethod: 'Cash' });
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', savedAmount: '' });
  const [billForm, setBillForm] = useState({ name: '', amount: '', dueDate: '' });

  const fetchDashboard = () => {
    fetch('http://localhost:8080/api/dashboard')
      .then(res => res.json())
      .then(json => {
        setData(json);
        if (json.monthlyIncome === 0) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income: incomeInput })
    }).then(() => fetchDashboard());
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...expenseForm,
        type: 'EXPENSE',
        transactionDate: new Date().toISOString().split('T')[0]
      })
    }).then(() => {
      setShowExpenseModal(false);
      setExpenseForm({ amount: '', category: 'Food & Dining', description: '', paymentMethod: 'Cash' });
      fetchDashboard();
    });
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalForm)
    }).then(() => {
      setShowGoalModal(false);
      setGoalForm({ name: '', targetAmount: '', savedAmount: '' });
      fetchDashboard();
    });
  };

  const handleBillSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billForm)
    }).then(() => {
      setShowBillModal(false);
      setBillForm({ name: '', amount: '', dueDate: '' });
      fetchDashboard();
    });
  };

  const getHealthColor = (score) => {
    if (score >= 70) return 'var(--success-color)';
    if (score >= 40) return '#f59e0b';
    return 'var(--danger-color)';
  };

  const renderDashboard = () => (
    <>
      <header className="header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, WalletFlow User!</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn" onClick={fetchDashboard}>Refresh</button>
          <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>+ Add Expense</button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">₹</div>
          <div>
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">₹{data.monthlyIncome.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">₹</div>
          <div>
            <div className="stat-label">Monthly Expenses</div>
            <div className="stat-value">₹{data.monthlyExpenses.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">₹</div>
          <div>
            <div className="stat-label">Net Balance</div>
            <div className="stat-value">₹{data.netBalance.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card health-score">
          <div className="circle" style={{borderColor: getHealthColor(data.healthScore)}}>
            {data.healthScore}
          </div>
          <div className="stat-label" style={{textAlign: 'center'}}>
            Financial Health<br/>
            <span style={{color: getHealthColor(data.healthScore)}}>
              {data.healthScore >= 70 ? 'Excellent' : data.healthScore >= 40 ? 'Fair' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="section-card">
            <h3 className="section-header">Recent Transactions</h3>
            <div className="transaction-list">
              {data.recentTransactions.length === 0 && <p style={{color: 'var(--text-muted)'}}>No transactions yet.</p>}
              {data.recentTransactions.map(tx => (
                <div className="transaction-item" key={tx.id}>
                  <div className="tx-info">
                    <div className="tx-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div className="tx-details">
                      <h4>{tx.category}</h4>
                      <p>{tx.transactionDate} · {tx.description}</p>
                    </div>
                  </div>
                  <div className="tx-amount">
                    <h4>-₹{tx.amount.toFixed(2)}</h4>
                    <p>{tx.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="section-card">
            <h3 className="section-header">
              Savings Goals
              <button className="btn btn-primary" style={{padding: '4px 8px', fontSize: '12px'}} onClick={() => setShowGoalModal(true)}>+ New Goal</button>
            </h3>
            <div className="goals-list">
              {(!data.goals || data.goals.length === 0) && <p style={{color: 'var(--text-muted)'}}>No goals set.</p>}
              {data.goals && data.goals.map(goal => {
                const percent = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
                return (
                  <div className="goal-item" key={goal.id}>
                    <div className="goal-header">
                      <h4>{goal.name}</h4>
                      <span>{percent.toFixed(0)}%</span>
                    </div>
                    <div className="goal-progress-bar">
                      <div className="goal-progress-fill" style={{width: `${percent}%`}}></div>
                    </div>
                    <div className="goal-footer">
                      <span>Saved: ₹{goal.savedAmount.toFixed(2)}</span>
                      <span>Target: ₹{goal.targetAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-header">Upcoming Bills</h3>
            <div style={{color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
              {(!data.upcomingBills || data.upcomingBills.length === 0) ? 'No upcoming bills.' : `${data.upcomingBills.length} upcoming bill(s)`}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCalendar = () => (
    <>
      <header className="header">
        <div>
          <h1>Calendar</h1>
          <p>Your transactions timeline</p>
        </div>
      </header>
      <section className="section-grid-full">
        <div className="section-card">
          <div className="transaction-list transaction-list-full">
            {data.recentTransactions.length === 0 && <p style={{color: 'var(--text-muted)'}}>No transactions yet.</p>}
            {data.recentTransactions.map(tx => (
              <div className="transaction-item" key={tx.id}>
                <div className="tx-info">
                  <div className="tx-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div className="tx-details">
                    <h4>{tx.transactionDate}</h4>
                    <p>{tx.category} · {tx.description}</p>
                  </div>
                </div>
                <div className="tx-amount">
                  <h4>-₹{tx.amount.toFixed(2)}</h4>
                  <p>{tx.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderGoals = () => (
    <>
      <header className="header">
        <div>
          <h1>Savings Goals</h1>
          <p>Track your targets and milestones</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowGoalModal(true)}>+ New Goal</button>
      </header>
      <section className="section-grid-full">
        <div className="section-card">
          <div className="goals-list">
            {(!data.goals || data.goals.length === 0) && <p style={{color: 'var(--text-muted)'}}>No goals set.</p>}
            {data.goals && data.goals.map(goal => {
              const percent = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
              return (
                <div className="goal-item" key={goal.id} style={{marginBottom: '24px'}}>
                  <div className="goal-header" style={{marginBottom: '12px'}}>
                    <h4 style={{fontSize: '18px'}}>{goal.name}</h4>
                    <span style={{fontSize: '18px'}}>{percent.toFixed(0)}%</span>
                  </div>
                  <div className="goal-progress-bar" style={{height: '16px', borderRadius: '8px'}}>
                    <div className="goal-progress-fill" style={{width: `${percent}%`, borderRadius: '8px'}}></div>
                  </div>
                  <div className="goal-footer" style={{marginTop: '12px', fontSize: '14px'}}>
                    <span>Saved: ₹{goal.savedAmount.toFixed(2)}</span>
                    <span>Target: ₹{goal.targetAmount.toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  );

  const renderBills = () => (
    <>
      <header className="header">
        <div>
          <h1>Bills & Subs</h1>
          <p>Manage your upcoming subscriptions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBillModal(true)}>+ Add Bill</button>
      </header>
      <section className="section-grid-full">
        <div className="section-card">
          <div className="transaction-list transaction-list-full">
            {(!data.upcomingBills || data.upcomingBills.length === 0) && <p style={{color: 'var(--text-muted)'}}>No upcoming bills.</p>}
            {data.upcomingBills && data.upcomingBills.map(bill => (
              <div className="transaction-item" key={bill.id}>
                <div className="tx-info">
                  <div className="tx-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div className="tx-details">
                    <h4>{bill.name}</h4>
                    <p>Due: {bill.dueDate}</p>
                  </div>
                </div>
                <div className="tx-amount">
                  <h4 style={{color: 'var(--text-main)'}}>₹{bill.amount.toFixed(2)}</h4>
                  <p>{bill.isPaid ? 'Paid' : 'Unpaid'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderAnalytics = () => {
    // Group transactions by category
    const categoryTotals = {};
    let totalExpense = 0;
    data.recentTransactions.forEach(tx => {
      if (tx.type === 'EXPENSE') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        totalExpense += tx.amount;
      }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    return (
      <>
        <header className="header">
          <div>
            <h1>Analytics</h1>
            <p>Expense breakdown by category</p>
          </div>
        </header>
        <section className="section-grid-full">
          <div className="section-card">
            <h3 className="section-header">Category Breakdown</h3>
            <div style={{marginTop: '24px'}}>
              {sortedCategories.length === 0 && <p style={{color: 'var(--text-muted)'}}>No data to analyze.</p>}
              {sortedCategories.map(([cat, amount]) => {
                const percent = (amount / totalExpense) * 100;
                return (
                  <div className="analytics-bar-container" key={cat}>
                    <div className="analytics-label">{cat}</div>
                    <div className="analytics-bar-bg">
                      <div className="analytics-bar-fill" style={{width: `${percent}%`}}></div>
                    </div>
                    <div className="analytics-value">₹{amount.toFixed(0)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  };

  if (loading) return <div style={{padding: 40}}>Loading...</div>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span>WalletFlow</span>
          <span style={{color: 'var(--text-muted)'}}>&lt;</span>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('Dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </div>
          <div className={`nav-item ${currentView === 'Calendar' ? 'active' : ''}`} onClick={() => setCurrentView('Calendar')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Calendar
          </div>
          <div className={`nav-item ${currentView === 'Goals' ? 'active' : ''}`} onClick={() => setCurrentView('Goals')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            Goals
          </div>
          <div className={`nav-item ${currentView === 'Bills' ? 'active' : ''}`} onClick={() => setCurrentView('Bills')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Bills & Subs
          </div>
          <div className={`nav-item ${currentView === 'Analytics' ? 'active' : ''}`} onClick={() => setCurrentView('Analytics')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'Dashboard' && renderDashboard()}
        {currentView === 'Calendar' && renderCalendar()}
        {currentView === 'Goals' && renderGoals()}
        {currentView === 'Bills' && renderBills()}
        {currentView === 'Analytics' && renderAnalytics()}
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Welcome to WalletFlow! 🚀</h2>
            <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>Let's start by setting your monthly income so we can track your financial health properly.</p>
            <form onSubmit={handleIncomeSubmit}>
              <div className="form-group">
                <label>Monthly Income (₹)</label>
                <input type="number" className="form-control" required value={incomeInput} onChange={e => setIncomeInput(e.target.value)} placeholder="e.g. 50000" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Save & Continue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Expense</h2>
            <form onSubmit={handleExpenseSubmit}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" className="form-control" required value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                  <option>Food & Dining</option>
                  <option>Shopping</option>
                  <option>Rent</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                  <option>Entertainment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" className="form-control" required value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} placeholder="e.g. Zudio T-shirt" />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select className="form-control" value={expenseForm.paymentMethod} onChange={e => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Savings Goal</h2>
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input type="text" className="form-control" required value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})} placeholder="e.g. MacBook Air" />
              </div>
              <div className="form-group">
                <label>Target Amount (₹)</label>
                <input type="number" className="form-control" required value={goalForm.targetAmount} onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Already Saved (₹)</label>
                <input type="number" className="form-control" required value={goalForm.savedAmount} onChange={e => setGoalForm({...goalForm, savedAmount: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowGoalModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {showBillModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Bill / Subscription</h2>
            <form onSubmit={handleBillSubmit}>
              <div className="form-group">
                <label>Bill Name</label>
                <input type="text" className="form-control" required value={billForm.name} onChange={e => setBillForm({...billForm, name: e.target.value})} placeholder="e.g. Netflix" />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" className="form-control" required value={billForm.amount} onChange={e => setBillForm({...billForm, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" className="form-control" required value={billForm.dueDate} onChange={e => setBillForm({...billForm, dueDate: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowBillModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
