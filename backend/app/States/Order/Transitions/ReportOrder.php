<?php

namespace App\States\Order\Transitions;

use App\Models\Order\Order;
use Spatie\ModelStates\DefaultTransition;
use Spatie\ModelStates\State;

class ReportOrder extends DefaultTransition
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function __construct($model, string $field, State $newState, private readonly array $data = [])
    {
        parent::__construct($model, $field, $newState);
    }

    public function handle(): Order
    {
        $this->model->date_report = $this->data['date_report'] ?? null;

        return parent::handle();
    }
}
