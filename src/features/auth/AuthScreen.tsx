import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Eye, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import type { Locale, Role, Session } from '../../types/pharmacy';

const copy={
 ar:{login:'تسجيل الدخول',register:'حساب جديد',welcome:'أهلاً برجوعك',start:'خلّينا نبدأ',loginD:'ادخل بحسابك وكمل طلبك من حيث وقفت.',registerD:'اعمل حساب في أقل من دقيقة وخلي صحتك أسهل.',name:'الاسم بالكامل',email:'البريد الإلكتروني',phone:'رقم الموبايل',password:'كلمة المرور',forgot:'نسيت كلمة المرور؟',submitLogin:'دخول',submitRegister:'إنشاء الحساب',or:'أو كمل باستخدام',google:'Google',safe:'بياناتك الطبية في أمان',safeD:'خصوصيتك محمية، وصلاحيات الحساب بتتحدد تلقائيًا.',back:'الرجوع للصيدلية',hero:'صحتك كلها في مكان واحد.',heroD:'تابع الروشتات، كرر علاجك الشهري واتكلم مع صيدلي حقيقي وقت ما تحتاج.',terms:'بإنشاء الحساب أنت توافق على الشروط وسياسة الخصوصية.'},
 en:{login:'Sign in',register:'Create account',welcome:'Welcome back',start:"Let's get started",loginD:'Sign in and continue exactly where you stopped.',registerD:'Create an account in under a minute and simplify your care.',name:'Full name',email:'Email address',phone:'Mobile number',password:'Password',forgot:'Forgot password?',submitLogin:'Sign in',submitRegister:'Create account',or:'Or continue with',google:'Google',safe:'Your health data stays safe',safeD:'Your privacy is protected and account access is assigned automatically.',back:'Back to pharmacy',hero:'All your health in one place.',heroD:'Track prescriptions, repeat monthly medicine and talk to a real pharmacist.',terms:'By creating an account you agree to our terms and privacy policy.'}
};

export function AuthScreen({locale,onLocaleChange,onAuthenticated}:{locale:Locale;onLocaleChange:(locale:Locale)=>void;onAuthenticated:(session:Session)=>void}){
 const [mode,setMode]=useState<'login'|'register'>('login'); const [show,setShow]=useState(false);
 const [form,setForm]=useState({name:'',email:'',phone:'',password:''}); const t=copy[locale];
 const submit=(e:FormEvent)=>{e.preventDefault();const email=form.email.toLowerCase();let role:Role='customer';if(email.includes('pharmacist'))role='pharmacist';else if(email.includes('delivery')||email.includes('courier'))role='delivery';else if(email.includes('admin'))role='admin';onAuthenticated({name:form.name||(locale==='ar'?'أحمد محمد':'Ahmed Mohamed'),email:form.email,role});};
 const Arrow=locale==='ar'?ArrowLeft:ArrowRight;
 return <main className="auth-modern">
  <section className="auth-brand-panel">
   <img src="/rxflow-pharmacy-hero.png" alt=""/><div className="auth-overlay"/>
   <Link to="/customer" className="auth-logo"><span><BadgeCheck/></span><b>RxFlow</b></Link>
   <div className="auth-hero-copy"><span><ShieldCheck size={17}/>{t.safe}</span><h1>{t.hero}</h1><p>{t.heroD}</p></div>
   <div className="auth-testimonial"><p>“{locale==='ar'?'طلبت روشتة ماما وتابعت مع الصيدلي خطوة بخطوة.':'I ordered my mother’s prescription and followed every step with the pharmacist.'}”</p><b>{locale==='ar'?'— مريم، عميلة RxFlow':'— Mariam, RxFlow customer'}</b></div>
  </section>
  <section className="auth-form-side"><div className="auth-top"><Link to="/customer"><Arrow size={17}/>{t.back}</Link><LanguageToggle locale={locale} onChange={onLocaleChange}/></div>
   <div className="auth-form-card"><div className="auth-tabs"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>{t.login}</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>{t.register}</button></div>
    <h2>{mode==='login'?t.welcome:t.start}</h2><p>{mode==='login'?t.loginD:t.registerD}</p>
    <form onSubmit={submit}>
     {mode==='register'&&<div className="auth-field"><label>{t.name}</label><span><UserRound/><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={locale==='ar'?'مثال: مريم حسن':'e.g. Mariam Hassan'}/></span></div>}
     <div className="auth-field"><label>{t.email}</label><span><Mail/><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@example.com"/></span></div>
     {mode==='register'&&<div className="auth-field"><label>{t.phone}</label><span><Phone/><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="01xx xxx xxxx"/></span></div>}
     <div className="auth-field"><div className="flex justify-between"><label>{t.password}</label>{mode==='login'&&<button type="button" className="forgot">{t.forgot}</button>}</div><span><LockKeyhole/><input required type={show?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/><button type="button" onClick={()=>setShow(!show)}><Eye/></button></span></div>
     <button className="auth-submit" type="submit">{mode==='login'?t.submitLogin:t.submitRegister}<Arrow/></button>
    </form>
    <div className="auth-divider"><span>{t.or}</span></div><button className="google-btn"><b>G</b>{t.google}</button>
    {mode==='register'&&<small className="auth-terms">{t.terms}</small>}
   </div>
  </section>
 </main>;
}
