'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { itemCount, isCartLoaded } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-burgundy-600 hover:text-burgundy-700">
            حور ستايلش
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sage-700 hover:text-burgundy-600 font-medium">
              الرئيسية
            </Link>
            <Link href="/products" className="text-sage-700 hover:text-burgundy-600 font-medium">
              المنتجات
            </Link>
            <Link href="/cart" className="relative text-sage-700 hover:text-burgundy-600">
              <ShoppingCart size={24} />
              {isCartLoaded && itemCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-gold-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-sage-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-sand-200">
            <Link
              href="/"
              className="block text-sage-700 hover:text-burgundy-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              className="block text-sage-700 hover:text-burgundy-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              المنتجات
            </Link>
            <Link
              href="/cart"
              className="block text-sage-700 hover:text-burgundy-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              سلة التسوق {isCartLoaded && itemCount > 0 ? `(${itemCount})` : ''}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
