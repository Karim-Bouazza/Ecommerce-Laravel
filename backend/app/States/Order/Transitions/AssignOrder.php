<?php

namespace App\States\Order\Transitions;

use App\Models\Order\Order;
use App\Services\Providers\ZimouPackageService;
use Spatie\ModelStates\DefaultTransition;

class AssignOrder extends DefaultTransition
{
    public function handle(): Order
    {
        app(ZimouPackageService::class)->createPackage($this->model);

        return parent::handle();
    }
}
