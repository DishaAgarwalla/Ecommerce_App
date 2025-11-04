package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;
import com.example.demo.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error retrieving orders: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> order = orderService.getOrderById(id);
            return order.map(value -> ResponseEntity.ok(ApiResponse.success("Order found", value)))
                       .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                           .body(ApiResponse.error("Order not found with id: " + id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error retrieving order: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUser(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error retrieving orders: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody Order order) {
        try {
            if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Order must have at least one item"));
            }
            
            Order createdOrder = orderService.createOrder(order, order.getOrderItems());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", createdOrder));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error creating order: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        try {
            if (!isValidStatus(status)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid status: " + status));
            }
            
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updatedOrder));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error updating order status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error deleting order: " + e.getMessage()));
        }
    }

    private boolean isValidStatus(String status) {
        return List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED")
                .contains(status.toUpperCase());
    }
}