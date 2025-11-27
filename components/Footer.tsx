import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-gold-400 mb-4">حور ستايلش</h3>
            <p className="text-sand-200 leading-relaxed">
              متجرك الأول للأزياء الإسلامية الأنيقة والمحتشمة. نقدم لك أفضل التصاميم العصرية مع الحفاظ على الاحتشام والأناقة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sand-200 hover:text-gold-300 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sand-200 hover:text-gold-300 transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sand-200 hover:text-gold-300 transition-colors">
                  سلة التسوق
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sand-200">
                <Phone size={18} />
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sand-200">
                <Mail size={18} />
                <span>info@hoorstylish.com</span>
              </li>
              <li className="flex items-center gap-3 text-sand-200">
                <MapPin size={18} />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="bg-sage-700 hover:bg-gold-600 p-2 rounded-full transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-sage-700 hover:bg-gold-600 p-2 rounded-full transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-sage-700 hover:bg-gold-600 p-2 rounded-full transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-sage-700 mt-8 pt-6 text-center text-sand-300">
          <p>© 2024 حور ستايلش. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
