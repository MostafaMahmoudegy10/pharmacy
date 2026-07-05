import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../api/apiClient';
import { Medicine, mockDb } from '../../../api/mockDb';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { useCartStore } from '../../../store/useCartStore';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { 
  Heart, ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck, 
  Sparkles, HelpCircle, Users, BellRing
} from 'lucide-react';

export const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language, t } = useLanguageStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, hasItem: isWishlisted } = useWishlistStore();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  // Restock Modal state
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [reqQty, setReqQty] = useState(1);
  const [reqPhone, setReqPhone] = useState(user?.phone || '');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  useEffect(() => {
    const fetchMed = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.medicines.get(id);
        setMedicine(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMed();
  }, [id, navigate]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine || !reqPhone) return;

    try {
      await api.requests.create({
        customerId: user?.id || 'guest',
        customerName: user?.name || 'Guest User',
        customerPhone: reqPhone,
        customerEmail: user?.email || 'guest@rxflow.com',
        medicineId: medicine.id,
        medicineName: medicine.name,
        medicineArName: medicine.arName,
        quantity: reqQty,
        notes: reqNotes
      });
      
      // Update local view
      const updated = await api.medicines.get(medicine.id);
      setMedicine(updated);
      setReqSuccess(true);
      setTimeout(() => {
        setIsReqModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-10">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) return null;

  const inStock = medicine.stock > 0;
  const hasAlternative = medicine.alternatives.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Back button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 space-x-reverse text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{language === 'en' ? 'Back to Formulations' : 'العودة لقائمة الأدوية'}</span>
        </Link>
      </div>

      {/* Main product card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        
        {/* Left Side: Product Image & Badges */}
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 aspect-video md:aspect-[4/3] border border-slate-100 dark:border-slate-800">
            <img 
              src={medicine.image} 
              alt={medicine.name} 
              className="object-cover w-full h-full"
            />
            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(medicine)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 shadow-md hover:scale-105 transition-transform"
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted(medicine.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-xs">
            <div className="p-3 border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl">
              <span className="text-slate-400 block mb-0.5">{language === 'en' ? 'Dispensing' : 'طريقة الصرف'}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {medicine.prescriptionRequired ? t('prescriptionRequired') : t('prescriptionNotRequired')}
              </span>
            </div>
            <div className="p-3 border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl">
              <span className="text-slate-400 block mb-0.5">{language === 'en' ? 'Stock Status' : 'حالة المخزون'}</span>
              <span className={`font-bold ${inStock ? 'text-emerald-500' : 'text-amber-500'}`}>
                {inStock ? `${t('inStock')} (${medicine.stock})` : t('outOfStock')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Specifications and Purchase Trigger */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-md">
                {language === 'ar' ? medicine.arCategory : medicine.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                {language === 'ar' ? medicine.arName : medicine.name}
              </h1>
              <p className="text-sm text-slate-400 font-medium mt-1">
                {t('activeIngredient')}: <span className="text-slate-700 dark:text-slate-300 font-bold">{language === 'ar' ? medicine.arActiveIngredient : medicine.activeIngredient}</span>
              </p>
            </div>

            <div className="text-2xl font-black text-slate-950 dark:text-white">
              ${medicine.price.toFixed(2)}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('description')}</h4>
              <p className="text-xs font-light text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'ar' ? medicine.arDescription : medicine.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {inStock ? (
              <div className="space-y-3">
                {/* Quantity selector */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-xs font-bold text-slate-400 uppercase">{t('quantity')}</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold">{qty}</span>
                    <button 
                      onClick={() => setQty(Math.min(medicine.stock, qty + 1))}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <Button 
                  onClick={() => addItem(medicine, qty)}
                  className="w-full py-3"
                >
                  <ShoppingCart className="h-4.5 w-4.5 mr-2 ml-2" />
                  {t('addToCart')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Out of Stock Alert triggers */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse text-amber-800 dark:text-amber-400">
                    <Users className="h-5 w-5" />
                    <span className="text-xs font-bold">
                      {medicine.requestsCount > 0 
                        ? `${t('waitingCustomers')}: ${medicine.requestsCount}` 
                        : (language === 'en' ? 'First requester gets priority refill alert' : 'سجل طلبك لتكون أول من يعلم بالتوفر')}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/80 font-light">
                    {language === 'en' 
                      ? 'This formulation is currently unavailable. Register below to prompt the pharmacists and receive instant notification alerts.'
                      : 'هذا الدواء غير متوفر حالياً. سجل طلبك لإبلاغ الصيدلي وتلقي تنبيهات التوفر التلقائية.'}
                  </p>
                </div>

                <Button 
                  onClick={() => {
                    setReqQty(1);
                    setReqPhone(user?.phone || '');
                    setReqNotes('');
                    setReqSuccess(false);
                    setIsReqModalOpen(true);
                  }}
                  variant="warning"
                  className="w-full py-3"
                >
                  <BellRing className="h-4.5 w-4.5 mr-2 ml-2 text-white animate-bounce" />
                  {t('notifyMe')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Recommendations Section */}
      {medicine.stock === 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('alternatives')}
          </h3>
          {hasAlternative ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicine.alternatives.map((altId) => {
                const alt = mockDb.getMedicine(altId);
                if (!alt) return null;
                
                return (
                  <div 
                    key={alt.id}
                    className="p-4 border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img 
                        src={alt.image} 
                        alt={alt.name} 
                        className="h-14 w-14 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {language === 'ar' ? alt.arName : alt.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {t('activeIngredient')}: {language === 'ar' ? alt.arActiveIngredient : alt.activeIngredient}
                        </p>
                        <span className="text-xs font-extrabold text-primary dark:text-primary-dark mt-1 block">
                          ${alt.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/medicine/${alt.id}`}>
                      <Button variant="outline" size="sm">
                        {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center bg-slate-50 dark:bg-slate-900/55 rounded-xl border text-slate-400 text-xs">
              {t('noAlternatives')}
            </div>
          )}
        </div>
      )}

      {/* Restock Request Modal */}
      <Modal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        title={t('requestTitle')}
      >
        {reqSuccess ? (
          <div className="text-center py-6 space-y-3">
            <span className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 inline-flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-emerald-500 fill-current" />
            </span>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {t('requestSuccess')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center space-x-3 space-x-reverse border border-slate-100 dark:border-slate-800">
              <Pill className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">{language === 'en' ? 'Item' : 'العنصر'}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? medicine.arName : medicine.name}
                </p>
              </div>
            </div>

            <Input
              label={t('reqQty')}
              type="number"
              min="1"
              value={reqQty}
              onChange={(e) => setReqQty(parseInt(e.target.value) || 1)}
              required
            />

            <Input
              label={t('reqPhone')}
              type="tel"
              placeholder="+201234567890"
              value={reqPhone}
              onChange={(e) => setReqPhone(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t('reqNotes')}
              </label>
              <textarea
                value={reqNotes}
                onChange={(e) => setReqNotes(e.target.value)}
                placeholder={language === 'en' ? 'E.g. Daily prescription usage limit.' : 'مثال: جرعة يومية مستمرة.'}
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm px-3.5 py-2.5"
              />
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsReqModalOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('submit')}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
