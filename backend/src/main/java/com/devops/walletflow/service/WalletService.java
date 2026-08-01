package com.devops.walletflow.service;

import com.devops.walletflow.model.*;
import com.devops.walletflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class WalletService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private GoalRepository goalRepository;
    
    @Autowired
    private BillRepository billRepository;

    public User getOrCreateDefaultUser() {
        return userRepository.findById(1L).orElseGet(() -> {
            User user = new User();
            user.setName("WalletFlow User");
            user.setEmail("user@walletflow.com");
            user.setMonthlyIncome(new BigDecimal("50000.00")); // default
            return userRepository.save(user);
        });
    }

    public User updateIncome(Long userId, BigDecimal income) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setMonthlyIncome(income);
        return userRepository.save(user);
    }

    public Transaction addTransaction(Transaction transaction) {
        User user = getOrCreateDefaultUser();
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public Goal addGoal(Goal goal) {
        User user = getOrCreateDefaultUser();
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    public Bill addBill(Bill bill) {
        User user = getOrCreateDefaultUser();
        bill.setUser(user);
        return billRepository.save(bill);
    }

    public Map<String, Object> getDashboardData(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Transaction> expenses = transactionRepository.findByUserIdAndType(userId, "EXPENSE");
        
        BigDecimal totalExpenses = expenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal netBalance = user.getMonthlyIncome().subtract(totalExpenses);
        
        // Simple Financial Health Score logic: (NetBalance / Income) * 100
        int healthScore = 100;
        if (user.getMonthlyIncome().compareTo(BigDecimal.ZERO) > 0) {
            double ratio = netBalance.doubleValue() / user.getMonthlyIncome().doubleValue();
            healthScore = (int) Math.max(0, Math.min(100, ratio * 100));
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("monthlyIncome", user.getMonthlyIncome());
        data.put("monthlyExpenses", totalExpenses);
        data.put("netBalance", netBalance);
        data.put("healthScore", healthScore);
        data.put("recentTransactions", transactionRepository.findByUserId(userId).stream().limit(5).toList());
        data.put("upcomingBills", billRepository.findByUserId(userId).stream().filter(b -> !b.isPaid()).toList());
        data.put("goals", goalRepository.findByUserId(userId));
        
        return data;
    }
}
