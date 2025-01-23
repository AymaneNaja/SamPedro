import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
              SamPedro is your one-stop shop for all your fashion and lifestyle needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm hover:underline">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm hover:underline">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm hover:underline">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:underline">All Products</Link></li>
              <li><Link href="/categories" className="text-sm hover:underline">Categories</Link></li>
              <li><Link href="/deals" className="text-sm hover:underline">Special Deals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="https://www.facebook.com/tondaghaya/" className="text-sm hover:underline">Facebook</a></li>
              <li><a href="https://www.instagram.com/aymane.naja/" className="text-sm hover:underline">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 SamPedro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

