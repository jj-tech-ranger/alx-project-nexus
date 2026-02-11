import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/placeholder.jpg"; 
  if (imagePath.startsWith("http")) return imagePath;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return `${apiUrl}${imagePath}`;
};

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const imageUrl = getImageUrl(product.image);

  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-lg border-border/50">
      <div className="relative aspect-square overflow-hidden bg-secondary/20">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {product.is_new && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full z-10">
            New
          </span>
        )}
      </div>
      <CardContent className="p-4 flex-1">
        <div className="text-sm text-muted-foreground mb-1">{product.category_name}</div>
        <Link href={`/product/${product.slug}`} className="hover:underline">
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-1">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviews_count} />
        <div className="mt-2 font-bold text-xl">${Number(product.price).toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => {
            addToCart(product, 1)
            toast.success("Added to cart")
          }}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
