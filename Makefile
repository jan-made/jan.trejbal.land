.PHONY: securityVerify

securityVerify: security
	gpg --verify static/.well-known/security.txt.sig static/.well-known/security.txt

security:
	gpg --default-key 7095AA73C194BD6057E96A91A68FC82122582BBD --armor --output static/.well-known/security.txt.sig --detach-sign static/.well-known/security.txt
