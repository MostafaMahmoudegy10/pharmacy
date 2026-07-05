import { mockDb, Medicine, Order, MedicineRequest, Prescription, Notification, User } from './mockDb';

const LATENCY = 350; // Mock network delay in ms

const delay = <T>(fn: () => T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, LATENCY);
  });
};

export const api = {
  auth: {
    login: (email: string, password: string): Promise<{ user: User; token: string }> => {
      return delay(() => {
        const users = mockDb.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error("Invalid email or password");
        // Simple mock login: passwords matching email prefixes
        return { user, token: `mock-jwt-token-${user.id}` };
      });
    },
    
    register: (email: string, name: string, phone: string): Promise<{ user: User; token: string }> => {
      return delay(() => {
        const users = mockDb.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("Email already registered");
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          phone,
          role: 'customer',
          notificationPrefs: { inApp: true, email: true, sms: true }
        };
        mockDb.createUser(newUser);
        return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
      });
    },

    updateProfile: (userId: string, data: Partial<User>): Promise<User> => {
      return delay(() => {
        const users = mockDb.getUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) throw new Error("User not found");
        const updatedUser = { ...users[idx], ...data };
        users[idx] = updatedUser;
        localStorage.setItem("rxflow_users", JSON.stringify(users));
        
        // Also update stored active session if it matches
        const activeSession = localStorage.getItem("rxflow_session");
        if (activeSession) {
          const session = JSON.parse(activeSession);
          if (session.user.id === userId) {
            session.user = updatedUser;
            localStorage.setItem("rxflow_session", JSON.stringify(session));
          }
        }
        
        return updatedUser;
      });
    }
  },

  medicines: {
    list: (): Promise<Medicine[]> => {
      return delay(() => mockDb.getMedicines());
    },
    
    get: (id: string): Promise<Medicine> => {
      return delay(() => {
        const m = mockDb.getMedicine(id);
        if (!m) throw new Error("Medicine not found");
        return m;
      });
    },
    
    create: (data: Omit<Medicine, 'id' | 'requestsCount'>): Promise<Medicine> => {
      return delay(() => mockDb.createMedicine(data));
    },
    
    update: (id: string, data: Partial<Medicine>): Promise<Medicine> => {
      return delay(() => mockDb.updateMedicine(id, data));
    },
    
    delete: (id: string): Promise<void> => {
      return delay(() => mockDb.deleteMedicine(id));
    },
    
    replenish: (id: string, amount: number): Promise<Medicine> => {
      return delay(() => mockDb.replenishStock(id, amount));
    }
  },

  orders: {
    list: (): Promise<Order[]> => {
      return delay(() => mockDb.getOrders());
    },
    
    getByUser: (userId: string): Promise<Order[]> => {
      return delay(() => mockDb.getOrdersByCustomer(userId));
    },
    
    create: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'timeline'>): Promise<Order> => {
      return delay(() => mockDb.createOrder(orderData));
    },
    
    updateStatus: (id: string, status: Order['status']): Promise<Order> => {
      return delay(() => mockDb.updateOrderStatus(id, status));
    }
  },

  requests: {
    list: (): Promise<MedicineRequest[]> => {
      return delay(() => mockDb.getRestockRequests());
    },
    
    create: (reqData: Omit<MedicineRequest, 'id' | 'date' | 'status'>): Promise<MedicineRequest> => {
      return delay(() => mockDb.createRestockRequest(reqData));
    }
  },

  prescriptions: {
    list: (): Promise<Prescription[]> => {
      return delay(() => mockDb.getPrescriptions());
    },
    
    getByUser: (userId: string): Promise<Prescription[]> => {
      return delay(() => mockDb.getPrescriptions().filter(p => p.customerId === userId));
    },
    
    create: (customerId: string, customerName: string, imageUrl: string): Promise<Prescription> => {
      return delay(() => mockDb.createPrescription(customerId, customerName, imageUrl));
    },
    
    updateStatus: (id: string, status: Prescription['status'], notes?: string, alternatives?: string[]): Promise<Prescription> => {
      return delay(() => mockDb.updatePrescriptionStatus(id, status, notes, alternatives));
    }
  },

  notifications: {
    list: (userId: string): Promise<Notification[]> => {
      return delay(() => mockDb.getNotifications(userId));
    },
    
    markAllRead: (userId: string): Promise<void> => {
      return delay(() => mockDb.markAllNotificationsRead(userId));
    }
  },

  inventory: {
    getHistory: (): Promise<any[]> => {
      return delay(() => mockDb.getInventoryHistory());
    }
  },

  coupons: {
    validate: (code: string): Promise<number> => {
      return delay(() => {
        const discount = mockDb.validateCoupon(code);
        if (discount === null) throw new Error("Invalid coupon code");
        return discount;
      });
    }
  }
};
