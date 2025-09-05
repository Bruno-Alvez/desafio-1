"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Filter,
  Package,
  Package2,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useUpdateStock 
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { CreateProductDto, UpdateProductDto, UpdateStockDto, PaginationDto, Product } from "@/types/api";
import { toast } from "sonner";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDescending, setSortDescending] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    stockQuantity: 0,
    minimumStock: 10,
    sku: "",
    barcode: "",
    weight: undefined,
    dimensions: undefined
  });
  const [stockData, setStockData] = useState<UpdateStockDto>({
    productId: "",
    quantity: 0,
    reason: ""
  });

  // Pagination
  const [pagination, setPagination] = useState<PaginationDto>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "name",
    sortDescending: false
  });

  // Hooks
  const { data: productsData, isLoading, error } = useProducts(
    pagination,
    selectedCategory === "all" ? undefined : selectedCategory,
    showInactive
  );
  const { data: categories } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateStockMutation = useUpdateStock();

  // Update pagination when filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      searchTerm,
      sortBy,
      sortDescending,
      pageNumber: 1 // Reset to first page when filters change
    }));
  }, [searchTerm, sortBy, sortDescending]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.categoryId || !formData.sku.trim()) {
      toast.error("Nome, categoria e SKU são obrigatórios");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Preço deve ser maior que 0");
      return;
    }

    if (!/^[A-Z0-9\-_]+$/.test(formData.sku)) {
      toast.error("SKU deve conter apenas letras maiúsculas, números, hífen e underscore");
      return;
    }

    if (formData.barcode && !/^\d+$/.test(formData.barcode)) {
      toast.error("Código de barras deve conter apenas números");
      return;
    }

    try {
      if (selectedProduct) {
        // Update existing product
        await updateProductMutation.mutateAsync({
          id: selectedProduct.id,
          data: {
            id: selectedProduct.id,
            ...formData,
            isActive: selectedProduct.isActive
          }
        });
        setIsEditDialogOpen(false);
        toast.success("Produto atualizado com sucesso");
      } else {
        // Create new product
        await createProductMutation.mutateAsync(formData);
        setIsCreateDialogOpen(false);
        toast.success("Produto criado com sucesso");
      }
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        stockQuantity: 0,
        minimumStock: 10,
        sku: "",
        barcode: "",
        weight: undefined,
        dimensions: undefined
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Não foi possível salvar o produto");
    }
  };

  // Handle stock update
  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("Selecione um produto para atualizar o estoque");
      return;
    }

    if (!stockData.reason.trim()) {
      toast.error("Motivo da alteração é obrigatório");
      return;
    }

    try {
      await updateStockMutation.mutateAsync({
        id: selectedProduct.id,
        data: stockData
      });
      setIsStockDialogOpen(false);
      setStockData({ productId: "", quantity: 0, reason: "" });
      setSelectedProduct(null);
      toast.success("Estoque atualizado com sucesso");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Não foi possível atualizar o estoque");
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stockQuantity: product.stockQuantity,
      minimumStock: product.minimumStock,
      sku: product.sku,
      barcode: product.barcode || "",
      weight: product.weight,
      dimensions: product.dimensions
    });
    setIsEditDialogOpen(true);
  };

  // Handle stock update dialog
  const handleStockDialog = (product: Product) => {
    setSelectedProduct(product);
    setStockData({
      productId: product.id,
      quantity: product.stockQuantity,
      reason: ""
    });
    setIsStockDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Produto excluído com sucesso");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Não foi possível excluir o produto");
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (product: Product) => {
    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        data: {
          ...product,
          isActive: !product.isActive
        }
      });
      toast.success(product.isActive ? "Produto desativado" : "Produto ativado");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Não foi possível atualizar o produto");
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get stock status
  const getStockStatus = (product: any) => {
    if (product.stockQuantity <= 0) {
      return { label: "Sem estoque", color: "bg-red-100 text-red-800" };
    } else if (product.stockQuantity <= product.minimumStock) {
      return { label: "Estoque baixo", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { label: "Em estoque", color: "bg-green-100 text-green-800" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar produtos</p>
          <p className="text-gray-500">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  const products = productsData?.items || [];
  const totalPages = productsData?.totalPages || 0;
  const currentPage = productsData?.pageNumber || 1;

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Produto</DialogTitle>
              <DialogDescription>
                Adicione um novo produto ao seu catálogo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Smartphone XYZ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="Ex: SMARTPHONE-001"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Estoque Inicial</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumStock">Estoque Mínimo</Label>
                    <Input
                      id="minimumStock"
                      type="number"
                      min="0"
                      value={formData.minimumStock}
                      onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 10 })}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Categoria *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="1234567890123"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending ? "Criando..." : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="stockQuantity">Estoque</SelectItem>
                <SelectItem value="createdAt">Data</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDescending(!sortDescending)}
            >
              {sortDescending ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive">Mostrar inativos</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package2 className="w-5 h-5 mr-2" />
            Produtos ({productsData?.totalCount || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                const category = categories?.find(c => c.id === product.categoryId);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {category?.name || "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={product.stockQuantity <= product.minimumStock ? "text-red-600 font-medium" : ""}>
                          {product.stockQuantity}
                        </span>
                        {product.stockQuantity <= product.minimumStock && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge 
                          variant={product.isActive ? "default" : "secondary"}
                          className={product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {product.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStockDialog(product)}
                          title="Atualizar estoque"
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(product)}
                          title={product.isActive ? "Desativar" : "Ativar"}
                        >
                          {product.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Excluir"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o produto "{product.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {products.length === 0 && (
            <div className="text-center py-8">
              <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum produto encontrado</p>
              <p className="text-sm text-gray-400">
                {searchTerm || selectedCategory !== "all" ? "Tente ajustar os filtros de busca" : "Crie seu primeiro produto"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
                  disabled={currentPage >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Smartphone XYZ"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU *</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ex: SMARTPHONE-001"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stockQuantity">Estoque</Label>
                  <Input
                    id="edit-stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minimumStock">Estoque Mínimo</Label>
                  <Input
                    id="edit-minimumStock"
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 10 })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-categoryId">Categoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-barcode">Código de Barras</Label>
                  <Input
                    id="edit-barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Estoque</DialogTitle>
            <DialogDescription>
              Atualize a quantidade em estoque do produto "{selectedProduct?.name}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="stock-quantity">Nova Quantidade</Label>
                <Input
                  id="stock-quantity"
                  type="number"
                  min="0"
                  value={stockData.quantity}
                  onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-reason">Motivo da Alteração *</Label>
                <Textarea
                  id="stock-reason"
                  value={stockData.reason}
                  onChange={(e) => setStockData({ ...stockData, reason: e.target.value })}
                  placeholder="Ex: Entrada de mercadoria, venda, ajuste de inventário..."
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStockDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateStockMutation.isPending}>
                {updateStockMutation.isPending ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}
