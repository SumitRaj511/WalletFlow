package com.devops.walletflow.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., MacBook Air
    
    private BigDecimal targetAmount;
    
    private BigDecimal savedAmount = BigDecimal.ZERO;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
