<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('fingerprint_key', 64)->nullable();
            $table->string('ip_key', 64)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('browser_name', 64)->nullable();
            $table->string('browser_version', 32)->nullable();
            $table->string('os_name', 64)->nullable();
            $table->string('os_version', 32)->nullable();
            $table->string('device_category', 32)->nullable();
            $table->string('phone_key', 64)->nullable();
            $table->string('address_key', 64)->nullable();
            $table->string('status', 32);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['fingerprint_key', 'created_at']);
            $table->index(['phone_key', 'created_at']);
            $table->index(['ip_key', 'created_at']);
            $table->index(['address_key', 'created_at']);
            $table->index('order_id');
        });

        Schema::create('fraud_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('order_attempt_id')->nullable()->constrained('order_attempts')->nullOnDelete();
            $table->unsignedTinyInteger('score');
            $table->string('risk_level', 16);
            $table->string('recommended_action', 32);
            $table->unsignedTinyInteger('daily_points')->default(0);
            $table->unsignedTinyInteger('historical_points')->default(0);
            $table->unsignedTinyInteger('outcome_points')->default(0);
            $table->json('counts');
            $table->json('historical');
            $table->json('reasons');
            $table->string('rules_version', 16);
            $table->timestamp('assessed_at');
            $table->timestamps();

            $table->index(['risk_level', 'score']);
            $table->index('assessed_at');
        });

        Schema::create('fraud_assessment_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fraud_assessment_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('old_score')->nullable();
            $table->unsignedTinyInteger('new_score');
            $table->string('old_risk_level', 16)->nullable();
            $table->string('new_risk_level', 16);
            $table->string('trigger', 32);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['fraud_assessment_id', 'created_at'], 'fraud_hist_assessment_created_idx');
        });

        Schema::create('fraud_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('label', 32)->default('UNKNOWN');
            $table->text('reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('label');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fraud_reviews');
        Schema::dropIfExists('fraud_assessment_histories');
        Schema::dropIfExists('fraud_assessments');
        Schema::dropIfExists('order_attempts');
    }
};
