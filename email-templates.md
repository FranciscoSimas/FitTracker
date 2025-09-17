# FitTracker - Email Templates Profissionais

## 1. Confirm Sign Up Template

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma o teu email - FitTracker</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 40px 20px; text-align: center; }
        .logo { background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-emoji { color: white; font-size: 24px; }
        .title { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .button { background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; }
        .footer-text { color: #999; font-size: 14px; margin: 0; }
        .footer-link { color: #8B5CF6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-emoji">💪</span>
            </div>
            <h1 class="title">FitTracker</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Bem-vindo ao FitTracker!</h2>
            <p class="message">
                Obrigado por te registares no FitTracker! Estamos entusiasmados por teres escolhido a nossa plataforma para acompanhares os teus treinos e alcançares os teus objetivos de fitness.
            </p>
            <p class="message">
                Para ativar a tua conta e começar a usar todas as funcionalidades, clica no botão abaixo para confirmar o teu email.
            </p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Confirmar Email</a>
            </div>
            
            <p class="message">
                Se não criaste uma conta no FitTracker, podes ignorar este email com segurança.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este email foi enviado pelo <a href="https://train-diary-plus-6hrv.vercel.app" class="footer-link">FitTracker</a><br>
                Se tiveres alguma questão, não hesites em contactar-nos.
            </p>
        </div>
    </div>
</body>
</html>
```

## 2. Reset Password Template

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Password - FitTracker</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 40px 20px; text-align: center; }
        .logo { background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-emoji { color: white; font-size: 24px; }
        .title { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .button { background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; }
        .footer-text { color: #999; font-size: 14px; margin: 0; }
        .footer-link { color: #8B5CF6; text-decoration: none; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .warning-text { color: #856404; font-size: 14px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-emoji">🔒</span>
            </div>
            <h1 class="title">FitTracker</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Redefinir Password</h2>
            <p class="message">
                Recebemos um pedido para redefinir a password da tua conta FitTracker. Se foste tu a fazer este pedido, clica no botão abaixo para criar uma nova password.
            </p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Redefinir Password</a>
            </div>
            
            <div class="warning">
                <p class="warning-text">
                    <strong>Importante:</strong> Este link expira em 24 horas por motivos de segurança. Se não pediste para redefinir a password, podes ignorar este email com segurança.
                </p>
            </div>
            
            <p class="message">
                Se continuas a ter problemas para aceder à tua conta, não hesites em contactar-nos.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este email foi enviado pelo <a href="https://train-diary-plus-6hrv.vercel.app" class="footer-link">FitTracker</a><br>
                Por motivos de segurança, não respondas a este email.
            </p>
        </div>
    </div>
</body>
</html>
```

## 3. Confirm Email Change Template

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar Mudança de Email - FitTracker</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 40px 20px; text-align: center; }
        .logo { background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-emoji { color: white; font-size: 24px; }
        .title { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .button { background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; }
        .footer-text { color: #999; font-size: 14px; margin: 0; }
        .footer-link { color: #8B5CF6; text-decoration: none; }
        .email-info { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .email-old { color: #666; font-size: 14px; margin: 0 0 5px 0; }
        .email-new { color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-emoji">📧</span>
            </div>
            <h1 class="title">FitTracker</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Confirmar Mudança de Email</h2>
            <p class="message">
                Recebemos um pedido para alterar o email da tua conta FitTracker. Para confirmar esta mudança, clica no botão abaixo.
            </p>
            
            <div class="email-info">
                <p class="email-old">Email atual: {{ .Email }}</p>
                <p class="email-new">Novo email: {{ .NewEmail }}</p>
            </div>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Confirmar Mudança</a>
            </div>
            
            <p class="message">
                Se não pediste para alterar o email da tua conta, podes ignorar este email com segurança. O teu email atual continuará a funcionar normalmente.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este email foi enviado pelo <a href="https://train-diary-plus-6hrv.vercel.app" class="footer-link">FitTracker</a><br>
                Se tiveres alguma questão, não hesites em contactar-nos.
            </p>
        </div>
    </div>
</body>
</html>
```
