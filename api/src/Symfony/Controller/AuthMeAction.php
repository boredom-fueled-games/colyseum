<?php

declare(strict_types=1);

namespace App\Symfony\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AsController]
final class AuthMeAction
{
    public function __construct(private Security $security, private NormalizerInterface $normalizer)
    {
    }

    public function __invoke(): Response
    {
        $user = $this->security->getUser();
        $json = $this->normalizer->normalize($user, 'jsonld', ['groups' => ['user:detail']]);

        return new JsonResponse($json);
    }
}
