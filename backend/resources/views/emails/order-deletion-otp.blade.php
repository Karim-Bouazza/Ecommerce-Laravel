<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #1f2937;">
    <p>Bonjour,</p>

    <p>
        Une demande de suppression a été faite pour la commande
        <strong>{{ $order->reference }}</strong>.
    </p>

    <p>Voici le code de vérification à usage unique :</p>

    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
        {{ $code }}
    </p>

    <p>Ce code expire dans 5 minutes et ne peut être utilisé qu'une seule fois.</p>

    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email et la commande ne sera pas supprimée.</p>
</body>
</html>
