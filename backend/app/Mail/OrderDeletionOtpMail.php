<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderDeletionOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $code,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Code de vérification - Suppression commande {$this->order->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-deletion-otp',
        );
    }
}
