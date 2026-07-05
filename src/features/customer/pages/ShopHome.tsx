import React, { useState, useEffect } from 'react';
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
  Search, Pill, ShieldAlert, Heart, ShoppingCart, 
  ArrowRight, Users, BellRing, Star, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ShopHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language, t } = useLanguageStore();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleWishlist, hasItem: isWishlisted } = useWishlistStore();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Refill Modal state
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [selectedMedForReq, setSelectedMedForReq] = useState<Medicine | null>(null);
  const [reqQty, setReqQty] = useState(1);
  const [reqPhone, setReqPhone] = useState(user?.phone || '');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  useEffect(() => {
    const fetchMeds = async () => {
      setLoading(true);
      try {
        const data = await api.medicines.list();
        setMedicines(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  const handleOpenReqModal = (medicine: Medicine) => {
    setSelectedMedForReq(medicine);
    setReqQty(1);
    setReqPhone(user?.phone || '');
    setReqNotes('');
    setReqSuccess(false);
    setIsReqModalOpen(true);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedForReq || !reqPhone) return;

    try {
      await api.requests.create({
        customerId: user?.id || 'guest',
        customerName: user?.name || 'Guest User',
        customerPhone: reqPhone,
        customerEmail: user?.email || 'guest@rxflow.com',
        medicineId: selectedMedForReq.id,
        medicineName: selectedMedForReq.name,
        medicineArName: selectedMedForReq.arName,
        quantity: reqQty,
        notes: reqNotes
      });
      
      // Update local view
      const updatedMeds = await api.medicines.list();
      setMedicines(updatedMeds);
      setReqSuccess(true);
      setTimeout(() => {
        setIsReqModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Categories list
  const categories = ['All', 'Cardiovascular', 'Antibiotics', 'Pain Relief', 'Respiratory', 'Gastrointestinal'];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.arName.includes(searchTerm) ||
      med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.arActiveIngredient.includes(searchTerm);
      
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Premium Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-indigo-600 to-primary-hover text-white p-8 md:p-12 shadow-xl shadow-primary/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-3xl -mr-16 -mt-16" />
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>{language === 'en' ? 'Bilingual Pharmacy Console' : 'منصة الصيدلية ثنائية اللغة'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {language === 'en' ? 'Premium Healthcare, Instantly Dispatched.' : 'رعاية صحية متميزة، تصرف فورياً.'}
          </h1>
          <p className="text-blue-100 font-light text-sm md:text-base leading-relaxed">
            {language === 'en' 
              ? 'Find medical items, submit digital prescriptions for verification, and request automated restock SMS/email notifications for scarce drugs.'
              : 'ابحث عن الأدوية، ارفع الوصفات الطبية لمراجعة الصيادلة، واطلب تنبيهات المخزون الفورية عبر الرسائل القصيرة والبريد الإلكتروني.'}
          </p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="w-full max-w-3xl mx-auto -mt-16 relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className={`absolute top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500 ${language === 'ar' ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-3 pr-4 pl-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-150 ${language === 'ar' ? 'pr-11' : 'pl-11'}`}
            />
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {t('categories')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active-spring border ${
                (selectedCategory === cat)
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Product Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'en' ? 'Available Formulations' : 'التركيبات الطبية المتاحة'}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {filteredMedicines.length} {language === 'en' ? 'products found' : 'منتجات تم العثور عليها'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-xl p-4 space-y-3 animate-pulse">
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-xl max-w-md mx-auto">
            <Pill className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{language === 'en' ? 'No medicines found' : 'لم يتم العثور على أدوية'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMedicines.map((med) => {
              const inStock = med.stock > 0;
              const hasAlternative = med.alternatives.length > 0;
              
              return (
                <div 
                  key={med.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col justify-between group"
                >
                  {/* Image container */}
                  <div className="relative bg-slate-50 dark:bg-slate-950/20 aspect-video overflow-hidden">
                    <img 
                      src={med.image} 
                      alt={med.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Prescription Required Badge */}
                    {med.prescriptionRequired && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-500/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                        {t('prescriptionRequired')}
                      </span>
                    )}

                    {/* Stock indicator badge */}
                    <span className={`absolute bottom-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm ${
                      inStock 
                        ? 'bg-emerald-500/95 text-white' 
                        : 'bg-amber-500/95 text-white'
                    }`}>
                      {inStock ? t('inStock') : t('outOfStock')}
                    </span>

                    {/* Wishlist toggle */}
                    <button
                      onClick={() => toggleWishlist(med)}
                      className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-rose-500 shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                      <Heart className={`h-3.5 w-3.5 ${isWishlisted(med.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {language === 'ar' ? med.arCategory : med.category}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary dark:group-hover:text-primary-dark transition-colors mt-0.5">
                        <Link to={`/medicine/${med.id}`}>
                          {language === 'ar' ? med.arName : med.name}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-1">
                        {t('activeIngredient')}: {language === 'ar' ? med.arActiveIngredient : med.activeIngredient}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-semibold text-slate-400">{t('price')}</span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          ${med.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Out-of-Stock specific sub-section */}
                      {!inStock && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg space-y-1.5 text-[11px]">
                          {/* Alternative Drug Offer */}
                          {hasAlternative ? (
                            <div>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">{t('alternatives')}:</span>
                              <div className="flex items-center justify-between mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
                                <span className="underline decoration-dotted truncate">
                                  {language === 'ar' 
                                    ? mockDb.getMedicine(med.alternatives[0])?.arName 
                                    : mockDb.getMedicine(med.alternatives[0])?.name
                                  }
                                </span>
                                <Link 
                                  to={`/medicine/${med.alternatives[0]}`}
                                  className="text-[10px] font-bold text-primary hover:underline flex items-center shrink-0"
                                >
                                  {language === 'en' ? 'View' : 'عرض'}
                                  <ArrowRight className="h-3 w-3 ml-0.5" />
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-light block">{t('noAlternatives')}</span>
                          )}
                          
                          {/* Waiting Customers Count */}
                          {med.requestsCount > 0 && (
                            <div className="flex items-center space-x-1 space-x-reverse text-amber-700 dark:text-amber-400 text-[10px] font-bold border-t border-amber-100/50 dark:border-amber-900/30 pt-1">
                              <Users className="h-3.5 w-3.5" />
                              <span>{t('waitingCustomers')}: {med.requestsCount}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      {inStock ? (
                        <Button 
                          onClick={() => addItem(med, 1)}
                          className="w-full text-xs font-semibold py-2"
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5 ml-1.5" />
                          {t('addToCart')}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleOpenReqModal(med)}
                          variant="outline"
                          className="w-full text-[11px] font-bold border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/20 py-2"
                        >
                          <BellRing className="h-3.5 w-3.5 mr-1.5 ml-1.5 text-amber-500 animate-bounce" />
                          {t('notifyMe')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Smart Restock Request Modal */}
      <Modal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        title={t('requestTitle')}
      >
        {reqSuccess ? (
          <div className="text-center py-6 space-y-3">
            <span className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 inline-flex items-center justify-center">
              <Star className="h-6 w-6 fill-current" />
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
                  {selectedMedForReq && (language === 'ar' ? selectedMedForReq.arName : selectedMedForReq.name)}
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
                placeholder={language === 'en' ? 'E.g. I need it for continuous usage.' : 'مثال: أحتاج إليه بصفة مستمرة.'}
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
