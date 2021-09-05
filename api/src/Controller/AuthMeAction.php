<?php

declare(strict_types=1);

namespace App\Controller;

use ApiPlatform\Core\JsonLd\Serializer\ItemNormalizer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;

#[AsController]
final class AuthMeAction
{
    public function __construct(private Security $security, private ItemNormalizer $normalizer)
    {
    }

    public function __invoke(): Response
    {
        $user = $this->security->getUser();
        $json = $this->normalizer->normalize($user, null, ['groups' => ['user:detail']]);

        return new JsonResponse($json);
    }
}
