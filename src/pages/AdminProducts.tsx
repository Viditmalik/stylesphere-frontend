import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
    });

    const { data: products, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Product created successfully" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: () => toast({ title: "Failed to create product", variant: "destructive" }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, product }: { id: number; product: any }) => updateProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Product updated successfully" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: () => toast({ title: "Failed to update product", variant: "destructive" }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Product deleted successfully" });
        },
        onError: () => toast({ title: "Failed to delete product", variant: "destructive" }),
    });

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", imageUrl: "", category: "" });
        setEditingProduct(null);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            imageUrl: product.images[0] || "",
            category: product.category,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
        };

        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, product: productData });
        } else {
            createMutation.mutate(productData);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Admin Dashboard - Products</CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="imageUrl">Image URL</Label>
                                        <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">{editingProduct ? "Update" : "Create"}</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.map((product: any) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminProducts;
