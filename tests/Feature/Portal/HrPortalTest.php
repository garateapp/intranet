<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HrPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_hr_portal_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('rrhh.index'))
            ->assertOk();
    }

    public function test_hr_redirect_uses_configured_setting(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('rrhh.redirect'))
            ->assertRedirect('https://greenex.buk.cl/users/sign_in');
    }
}
