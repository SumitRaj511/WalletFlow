package com.devops.walletflow.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    
    private String category; // e.g., Food, Rent, Shopping
    
    private BigDecimal amount;
    
    private String paymentMethod; // Cash, Credit Card
    
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate transactionDate;
    
    private String type; // INCOME or EXPENSE
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
