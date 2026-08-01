package com.devops.walletflow.controller;

import com.devops.walletflow.model.*;
import com.devops.walletflow.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React frontend to communicate during dev
public class ApiController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        User user = walletService.getOrCreateDefaultUser();
        return ResponseEntity.ok(walletService.getDashboardData(user.getId()));
    }

    @PostMapping("/income")
    public ResponseEntity<User> updateIncome(@RequestBody Map<String, String> payload) {
        User user = walletService.getOrCreateDefaultUser();
        BigDecimal newIncome = new BigDecimal(payload.get("income"));
        return ResponseEntity.ok(walletService.updateIncome(user.getId(), newIncome));
    }

    @PostMapping("/transaction")
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(walletService.addTransaction(transaction));
    }
    
    @PostMapping("/goal")
    public ResponseEntity<Goal> addGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(walletService.addGoal(goal));
    }
    
    @PostMapping("/bill")
    public ResponseEntity<Bill> addBill(@RequestBody Bill bill) {
        return ResponseEntity.ok(walletService.addBill(bill));
    }
}
