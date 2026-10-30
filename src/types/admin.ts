export interface RecentOrder {
    id: number;
    orderNumber : string;
    customerName: string;
    totalAmount : number;
    status : string;
    createdAt : string;
}
 
export interface AdminDashboard {
    totalProducts: number;
    totalCategories : number;
    totalUsers : number;
    totalOrders : number;

    pendingOrders: number;
    processingOrders: number;
    shippedOrders : number;
    deliveredOrders : number;
    cancelledOrders : number;

    totalRevenue : number;

    recentOrders : RecentOrder[];

}