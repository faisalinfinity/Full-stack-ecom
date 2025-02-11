import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image:string
}

interface PaginationInfo {
  total: number
  page: number
  totalPages: number
  limit: number
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  const fetchProducts = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?page=${page}`)
      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      })
      navigate("/auth")
      return
    }
    setSelectedProduct(product)
    setQuantity(1)
    setIsModalOpen(true)
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity,
      })
      setIsModalOpen(false)
      toast({
        title: "Added to Cart",
        description: `${quantity} ${selectedProduct.name}(s) added to your cart.`,
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Our Products</h1>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
            <img
                src={product.image}
                alt={product.name}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://picsum.photos/seed/${product.id}/400/300")
                }
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAddToCart(product)} disabled={product.stock === 0} className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {pagination && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <span className="mx-4 flex items-center">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">Product: {selectedProduct?.name}</p>
            <p className="mb-4">Price: ${selectedProduct?.price.toFixed(2)}</p>
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedProduct?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value)))}
                className="w-20"
              />
            </div>
            <p className="mt-4 font-semibold">Total: ${((selectedProduct?.price || 0) * quantity).toFixed(2)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAddToCart}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductsPage


