package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return orderRepository.findByUser(user);
    }

    @Transactional
    public Order createOrder(Order order, List<OrderItem> orderItems) {
        // Validate stock availability first
        for (OrderItem item : orderItems) {
            Product product = item.getProduct();
            
            // Check if stock quantity is null
            if (product.getStockQuantity() == null) {
                throw new RuntimeException("Product " + product.getId() + " has no stock quantity set");
            }
            
            // Check if sufficient stock is available
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getId() + 
                                         ". Available: " + product.getStockQuantity() + 
                                         ", Requested: " + item.getQuantity());
            }
            
            // Validate that price is not null
            if (item.getPrice() == null) {
                throw new RuntimeException("Price cannot be null for product: " + product.getId());
            }
        }
        
        // Calculate total amount
        BigDecimal totalAmount = orderItems.stream()
            .map(item -> {
                // Safe to call multiply now since we validated price is not null
                return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setTotalAmount(totalAmount);
        
        // Save order first
        Order savedOrder = orderRepository.save(order);
        
        // Set order reference for each order item and update stock
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            
            // Update product stock (safe because we validated above)
            Product product = item.getProduct();
            Integer currentStock = product.getStockQuantity();
            product.setStockQuantity(currentStock - item.getQuantity());
            productRepository.save(product);
        }
        
        savedOrder.setOrderItems(orderItems);
        return orderRepository.save(savedOrder);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }
}